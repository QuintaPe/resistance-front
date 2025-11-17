import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { PublicState } from "../types";
import { saveSessionData, getSessionData, clearSessionData } from "../utils/sessionStorage";

// =========================
// 📦 Separar URL en variable de entorno
// =========================
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000";

// =========================
// ⚙️ Contexto
// =========================

interface SocketContextValue {
    socket: Socket;
    connected: boolean;
    playerId: string | null;
    roomState: PublicState | null;
    role: "spy" | "resistance" | null;
    spies: string[]; // visible solo si eres espía
    setRoomState: React.Dispatch<React.SetStateAction<PublicState | null>>;
    isReconnecting: boolean; // Estado de reconexión
    notification: string | null; // Notificación actual
    disconnectedPlayers: string[]; // IDs de jugadores temporalmente desconectados

    // Métodos principales
    createRoom: (name: string, callback?: (roomCode: string) => void) => void;
    joinRoom: (roomCode: string, name: string, callback?: (ok: boolean, error?: string) => void) => void;
    startGame: (roomCode: string) => void;
    requestRole: (roomCode: string) => void;
    restartGame: (roomCode: string, callback?: (ok: boolean, error?: string) => void) => void;
    returnToLobby: (roomCode: string, callback?: (ok: boolean, error?: string) => void) => void;
    leaveRoom: () => void; // Salir voluntariamente
    kickPlayer: (roomCode: string, targetPlayerId: string, callback?: (ok: boolean, error?: string) => void) => void; // Expulsar jugador (solo creador)
    changeLeader: (roomCode: string, newLeaderIndex: number, callback?: (ok: boolean, error?: string) => void) => void; // Cambiar líder (solo creador en lobby)
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// =========================
// 🧠 Hook de acceso rápido
// =========================

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocket debe usarse dentro de <SocketProvider>");
    return ctx;
};

// =========================
// 🧩 Provider principal
// =========================

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket] = useState(() =>
        io(SOCKET_SERVER_URL, {
            // 📱 Configuración optimizada para móviles
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
        })
    );
    const [connected, setConnected] = useState(false);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [roomState, setRoomState] = useState<PublicState | null>(null);
    const [role, setRole] = useState<"spy" | "resistance" | null>(null);
    const [spies, setSpies] = useState<string[]>([]);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [disconnectedPlayers, setDisconnectedPlayers] = useState<string[]>([]); // Jugadores temporalmente desconectados

    // =========================
    // 📡 Conexión inicial y reconexión automática
    // =========================
    useEffect(() => {
        socket.on("connect", () => {
            console.log("🔌 Socket conectado:", socket.id);
            setConnected(true);

            // 🔄 Intentar reconexión automática
            const { sessionId, roomCode, playerName } = getSessionData();

            if (sessionId && roomCode && playerName) {
                console.log("🔄 Intentando reconexión automática...");
                setIsReconnecting(true);

                // 🔑 Usar el sessionId como playerId durante la reconexión
                setPlayerId(sessionId);

                socket.emit(
                    "room:join",
                    { roomCode, name: playerName, sessionId },
                    (response: {
                        roomCode?: string;
                        playerId?: string;
                        sessionId?: string;
                        reconnected?: boolean;
                        error?: string;
                    }) => {
                        setIsReconnecting(false);

                        if (response.error) {
                            console.error("❌ Error de reconexión:", response.error);
                            // Limpiar datos si la reconexión falló
                            clearSessionData();
                            setPlayerId(null);
                            setNotification("No se pudo reconectar. Vuelve a unirte a la sala.");
                            setTimeout(() => setNotification(null), 5000);
                        } else if (response.reconnected) {
                            console.log("✅ Reconexión exitosa!");
                            // 🔑 El playerId debe ser el sessionId, no el socket.id
                            setPlayerId(response.playerId || sessionId);
                            setNotification("✅ Reconectado exitosamente");
                            setTimeout(() => setNotification(null), 3000);
                            // El servidor enviará automáticamente game:role y game:update
                        } else {
                            // Reconexión normal sin error pero no es una reconexión de sesión previa
                            setPlayerId(response.playerId || null);
                            setNotification(null);
                        }
                    }
                );
            } else {
                // No hay sesión previa, limpiar notificación de desconexión
                setNotification(null);
            }
        });

        socket.on("disconnect", (reason) => {
            console.log("🔌 Desconectado del servidor:", reason);
            setConnected(false);

            // Solo mostrar notificación si es una desconexión inesperada
            if (reason !== "io client disconnect") {
                setNotification("Conexión perdida. Reconectando...");
            }
        });

        // Estado público del juego
        socket.on("room:update", (state: PublicState) => {
            console.log("📡 room:update recibido:", { phase: state.phase, playersCount: state.players.length });
            setRoomState(state);
            // Si volvemos al lobby, limpiar roles
            if (state.phase === "lobby") {
                console.log("🏠 Fase cambiada a lobby - limpiando roles");
                setRole(null);
                setSpies([]);
            }
        });

        socket.on("game:update", (state: PublicState) => {
            setRoomState(state);
        });

        // Rol privado del jugador (solo recibido una vez por jugador)
        socket.on("game:role", (data: { role: "spy" | "resistance"; spies?: string[] }) => {
            setRole(data.role);
            if (data.spies) setSpies(data.spies);
        });

        // 📢 Notificación cuando un jugador se desconecta
        socket.on("player:disconnected", (data: { playerId: string; message: string; isTemporary?: boolean }) => {
            console.log("⚠️ Jugador desconectado:", data.message, "Temporal:", data.isTemporary);

            // Si es una desconexión temporal, agregar a la lista de desconectados
            if (data.isTemporary) {
                setDisconnectedPlayers(prev => {
                    if (!prev.includes(data.playerId)) {
                        return [...prev, data.playerId];
                    }
                    return prev;
                });
            }

            setNotification(data.message);
            setTimeout(() => setNotification(null), 5000);
        });

        // 📢 Notificación cuando un jugador se reconecta
        socket.on("player:reconnected", (data: { playerId: string; message: string }) => {
            console.log("✅ Jugador reconectado:", data.message);

            // Remover de la lista de desconectados
            setDisconnectedPlayers(prev => prev.filter(id => id !== data.playerId));

            setNotification(data.message);
            setTimeout(() => setNotification(null), 3000);
        });

        // 👢 Cuando te expulsan de la sala
        socket.on("player:kicked", (data: { message: string }) => {
            console.log("❌ Expulsado de la sala:", data.message);
            setNotification(data.message);
            // Limpiar datos de sesión
            clearSessionData();
            setRole(null);
            setSpies([]);
            setRoomState(null);
            // La navegación al home la manejará el componente que escuche esto
        });

        // 👑 Cuando cambia el creador
        socket.on("creator:changed", (data: { message: string }) => {
            console.log("👑 Cambio de creador:", data.message);
            setNotification(data.message);
            setTimeout(() => setNotification(null), 4000);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("room:update");
            socket.off("game:update");
            socket.off("game:role");
            socket.off("player:disconnected");
            socket.off("player:reconnected");
            socket.off("player:kicked");
            socket.off("creator:changed");
        };
    }, [socket]);

    // =========================
    // 🧭 Métodos públicos
    // =========================

    const createRoom = useCallback(
        (name: string, callback?: (roomCode: string) => void) => {
            socket.emit(
                "room:create",
                { name },
                (response: { roomCode: string; playerId: string; sessionId: string }) => {
                    // 🔑 El playerId debe ser el sessionId para mantener consistencia
                    setPlayerId(response.sessionId);
                    // 💾 Guardar sessionId para reconexión
                    saveSessionData(response.sessionId, response.roomCode, name);
                    console.log("💾 Sesión guardada:", {
                        sessionId: response.sessionId,
                        roomCode: response.roomCode,
                        playerId: response.sessionId,
                    });
                    if (callback) callback(response.roomCode);
                }
            );
        },
        [socket]
    );

    const joinRoom = useCallback(
        (roomCode: string, name: string, callback?: (ok: boolean, error?: string) => void) => {
            socket.emit(
                "room:join",
                { roomCode, name },
                (response: {
                    roomCode?: string;
                    playerId?: string;
                    sessionId?: string;
                    error?: string;
                }) => {
                    if (response.error) {
                        callback?.(false, response.error);
                    } else {
                        // 🔑 El playerId debe ser el sessionId para mantener consistencia
                        setPlayerId(response.sessionId || null);
                        // 💾 Guardar sessionId para reconexión
                        if (response.sessionId) {
                            saveSessionData(response.sessionId, roomCode, name);
                            console.log("💾 Sesión guardada:", {
                                sessionId: response.sessionId,
                                roomCode: roomCode,
                                playerId: response.sessionId,
                            });
                        }
                        callback?.(true);
                    }
                }
            );
        },
        [socket]
    );

    const startGame = useCallback(
        (roomCode: string) => {
            socket.emit("game:start", { roomCode });
        },
        [socket]
    );

    const requestRole = useCallback(
        (roomCode: string) => {
            socket.emit("game:requestRole", { roomCode });
        },
        [socket]
    );

    const restartGame = useCallback(
        (roomCode: string, callback?: (ok: boolean, error?: string) => void) => {
            socket.emit(
                "game:restart",
                { roomCode },
                (response: { ok?: boolean; error?: string }) => {
                    if (response.error) {
                        callback?.(false, response.error);
                    } else {
                        callback?.(true);
                    }
                }
            );
        },
        [socket]
    );

    const returnToLobby = useCallback(
        (roomCode: string, callback?: (ok: boolean, error?: string) => void) => {
            socket.emit(
                "game:returnToLobby",
                { roomCode },
                (response: { ok?: boolean; error?: string }) => {
                    if (response.error) {
                        callback?.(false, response.error);
                    } else {
                        callback?.(true);
                    }
                }
            );
        },
        [socket]
    );

    const leaveRoom = useCallback(() => {
        console.log("🚪 Saliendo de la sala voluntariamente");
        // Limpiar datos de sesión
        clearSessionData();
        // Resetear estados
        setRole(null);
        setSpies([]);
        setRoomState(null);
        setDisconnectedPlayers([]); // Limpiar lista de desconectados
        // Desconectar y reconectar para limpiar el socket
        socket.disconnect();
        socket.connect();
    }, [socket]);

    const kickPlayer = useCallback(
        (roomCode: string, targetPlayerId: string, callback?: (ok: boolean, error?: string) => void) => {
            socket.emit(
                "player:kick",
                { roomCode, targetPlayerId },
                (response: { success?: boolean; error?: string }) => {
                    if (response.error) {
                        callback?.(false, response.error);
                    } else {
                        callback?.(true);
                    }
                }
            );
        },
        [socket]
    );

    const changeLeader = useCallback(
        (roomCode: string, newLeaderIndex: number, callback?: (ok: boolean, error?: string) => void) => {
            socket.emit(
                "room:changeLeader",
                { roomCode, newLeaderIndex },
                (response: { success?: boolean; error?: string }) => {
                    if (response.error) {
                        callback?.(false, response.error);
                    } else {
                        callback?.(true);
                    }
                }
            );
        },
        [socket]
    );

    // =========================
    // 💾 Context Value
    // =========================
    const value: SocketContextValue = {
        socket,
        connected,
        playerId,
        roomState,
        role,
        spies,
        setRoomState,
        isReconnecting,
        notification,
        disconnectedPlayers,
        createRoom,
        joinRoom,
        startGame,
        requestRole,
        restartGame,
        returnToLobby,
        leaveRoom,
        kickPlayer,
        changeLeader,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
