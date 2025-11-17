import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { PublicState, Role, CreateRoomResponse, JoinRoomResponse, GameRoleData } from "../types";
import { saveSessionData, getSessionData, clearSessionData } from "../utils";
import { SOCKET_SERVER_URL, SOCKET_CONFIG, SOCKET_EVENTS } from "../constants";
import { TIMINGS } from "../constants";

// =========================
// ⚙️ Contexto
// =========================

interface SocketContextValue {
    socket: Socket;
    connected: boolean;
    playerId: string | null;
    roomState: PublicState | null;
    role: Role | null;
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
    const [socket] = useState(() => io(SOCKET_SERVER_URL, SOCKET_CONFIG));
    const [connected, setConnected] = useState(false);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [roomState, setRoomState] = useState<PublicState | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [spies, setSpies] = useState<string[]>([]);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [disconnectedPlayers, setDisconnectedPlayers] = useState<string[]>([]); // Jugadores temporalmente desconectados

    // =========================
    // 📡 Conexión inicial y reconexión automática
    // =========================
    useEffect(() => {
        socket.on(SOCKET_EVENTS.CONNECT, () => {
            setConnected(true);

            // 🔄 Intentar reconexión automática
            const { sessionId, roomCode, playerName } = getSessionData();

            if (sessionId && roomCode && playerName) {
                setIsReconnecting(true);

                // 🔑 Usar el sessionId como playerId durante la reconexión
                setPlayerId(sessionId);

                socket.emit(
                    SOCKET_EVENTS.ROOM_JOIN,
                    { roomCode, name: playerName, sessionId },
                    (response: JoinRoomResponse) => {
                        setIsReconnecting(false);

                        if (response.error) {
                            // Limpiar datos si la reconexión falló
                            clearSessionData();
                            setPlayerId(null);
                            setNotification("No se pudo reconectar. Vuelve a unirte a la sala.");
                            setTimeout(() => setNotification(null), TIMINGS.NOTIFICATION_DURATION);
                        } else if (response.reconnected) {
                            // 🔑 El playerId debe ser el sessionId, no el socket.id
                            setPlayerId(response.playerId || sessionId);
                            setNotification("✅ Reconectado exitosamente");
                            setTimeout(() => setNotification(null), TIMINGS.SUCCESS_NOTIFICATION);
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

        socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            setConnected(false);

            // Solo mostrar notificación si es una desconexión inesperada
            if (reason !== "io client disconnect") {
                setNotification("Conexión perdida. Reconectando...");
            }
        });

        // Estado público del juego
        socket.on(SOCKET_EVENTS.ROOM_UPDATE, (state: PublicState) => {
            setRoomState(state);
            // Si volvemos al lobby, limpiar roles
            if (state.phase === "lobby") {
                setRole(null);
                setSpies([]);
            }
        });

        socket.on(SOCKET_EVENTS.GAME_UPDATE, (state: PublicState) => {
            setRoomState(state);
        });

        // Rol privado del jugador (solo recibido una vez por jugador)
        socket.on(SOCKET_EVENTS.GAME_ROLE, (data: GameRoleData) => {
            setRole(data.role);
            if (data.spies) setSpies(data.spies);
        });

        // 📢 Notificación cuando un jugador se desconecta
        socket.on(SOCKET_EVENTS.PLAYER_DISCONNECTED, (data: { playerId: string; message: string; isTemporary?: boolean }) => {
            // Si es una desconexión temporal, agregar a la lista de desconectados
            if (data.isTemporary) {
                setDisconnectedPlayers(prev => {
                    const newList = prev.includes(data.playerId) ? prev : [...prev, data.playerId];
                    return newList;
                });
            }

            setNotification(data.message);
            setTimeout(() => setNotification(null), TIMINGS.NOTIFICATION_DURATION);
        });

        // 📢 Notificación cuando un jugador se reconecta
        socket.on(SOCKET_EVENTS.PLAYER_RECONNECTED, (data: { playerId: string; message: string }) => {
            // Remover de la lista de desconectados
            setDisconnectedPlayers(prev => {
                const newList = prev.filter(id => id !== data.playerId);
                return newList;
            });

            setNotification(data.message);
            setTimeout(() => setNotification(null), TIMINGS.SUCCESS_NOTIFICATION);
        });

        // 👢 Cuando te expulsan de la sala
        socket.on(SOCKET_EVENTS.PLAYER_KICKED, (data: { message: string }) => {
            setNotification(data.message);
            // Limpiar datos de sesión
            clearSessionData();
            setRole(null);
            setSpies([]);
            setRoomState(null);
            // La navegación al home la manejará el componente que escuche esto
        });

        // 👑 Cuando cambia el creador
        socket.on(SOCKET_EVENTS.CREATOR_CHANGED, (data: { message: string }) => {
            setNotification(data.message);
            setTimeout(() => setNotification(null), 4000);
        });

        return () => {
            socket.off(SOCKET_EVENTS.CONNECT);
            socket.off(SOCKET_EVENTS.DISCONNECT);
            socket.off(SOCKET_EVENTS.ROOM_UPDATE);
            socket.off(SOCKET_EVENTS.GAME_UPDATE);
            socket.off(SOCKET_EVENTS.GAME_ROLE);
            socket.off(SOCKET_EVENTS.PLAYER_DISCONNECTED);
            socket.off(SOCKET_EVENTS.PLAYER_RECONNECTED);
            socket.off(SOCKET_EVENTS.PLAYER_KICKED);
            socket.off(SOCKET_EVENTS.CREATOR_CHANGED);
        };
    }, [socket]);

    // =========================
    // 🧭 Métodos públicos
    // =========================

    const createRoom = useCallback(
        (name: string, callback?: (roomCode: string) => void) => {
            socket.emit(
                SOCKET_EVENTS.ROOM_CREATE,
                { name },
                (response: CreateRoomResponse) => {
                    // 🔑 El playerId debe ser el sessionId para mantener consistencia
                    setPlayerId(response.sessionId);
                    // 💾 Guardar sessionId para reconexión
                    saveSessionData(response.sessionId, response.roomCode, name);
                    if (callback) callback(response.roomCode);
                }
            );
        },
        [socket]
    );

    const joinRoom = useCallback(
        (roomCode: string, name: string, callback?: (ok: boolean, error?: string) => void) => {
            socket.emit(
                SOCKET_EVENTS.ROOM_JOIN,
                { roomCode, name },
                (response: JoinRoomResponse) => {
                    if (response.error) {
                        callback?.(false, response.error);
                    } else {
                        // 🔑 El playerId debe ser el sessionId para mantener consistencia
                        setPlayerId(response.sessionId || null);
                        // 💾 Guardar sessionId para reconexión
                        if (response.sessionId) {
                            saveSessionData(response.sessionId, roomCode, name);
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
            socket.emit(SOCKET_EVENTS.GAME_START, { roomCode });
        },
        [socket]
    );

    const requestRole = useCallback(
        (roomCode: string) => {
            socket.emit(SOCKET_EVENTS.GAME_REQUEST_ROLE, { roomCode });
        },
        [socket]
    );

    const restartGame = useCallback(
        (roomCode: string, callback?: (ok: boolean, error?: string) => void) => {
            socket.emit(
                SOCKET_EVENTS.GAME_RESTART,
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
                SOCKET_EVENTS.GAME_RETURN_TO_LOBBY,
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
                SOCKET_EVENTS.PLAYER_KICK,
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
                SOCKET_EVENTS.ROOM_CHANGE_LEADER,
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
