import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { PublicState } from "../types";

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

    // Métodos principales
    createRoom: (name: string, callback?: (roomCode: string) => void) => void;
    joinRoom: (roomCode: string, name: string, callback?: (ok: boolean, error?: string) => void) => void;
    startGame: (roomCode: string) => void;
    requestRole: (roomCode: string) => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// =========================
// 🧠 Hook de acceso rápido
// =========================

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocket debe usarse dentro de <SocketProvider>");
    return ctx;
};

// =========================
// 🧩 Provider principal
// =========================

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket] = useState(() => io("http://localhost:3000", { transports: ["websocket"] }));
    const [connected, setConnected] = useState(false);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [roomState, setRoomState] = useState<PublicState | null>(null);
    const [role, setRole] = useState<"spy" | "resistance" | null>(null);
    const [spies, setSpies] = useState<string[]>([]);

    // =========================
    // 📡 Conexión inicial
    // =========================
    useEffect(() => {
        socket.on("connect", () => {
            setConnected(true);
            setPlayerId(socket.id || null);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        // Estado público del juego
        socket.on("room:update", (state: PublicState) => {
            setRoomState(state);
        });

        socket.on("game:update", (state: PublicState) => {
            setRoomState(state);
        });

        // Rol privado del jugador (solo recibido una vez por jugador)
        socket.on("game:role", (data: { role: "spy" | "resistance"; spies?: string[] }) => {
            console.log("🎭 Rol recibido:", data.role, "Espías:", data.spies);
            setRole(data.role);
            if (data.spies) setSpies(data.spies);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("room:update");
            socket.off("game:update");
            socket.off("game:role");
        };
    }, [socket]);

    // =========================
    // 🧭 Métodos públicos
    // =========================

    const createRoom = useCallback(
        (name: string, callback?: (roomCode: string) => void) => {
            socket.emit("room:create", { name }, (response: { roomCode: string; playerId: string }) => {
                setPlayerId(response.playerId);
                if (callback) callback(response.roomCode);
            });
        },
        [socket]
    );

    const joinRoom = useCallback(
        (roomCode: string, name: string, callback?: (ok: boolean, error?: string) => void) => {
            socket.emit(
                "room:join",
                { roomCode, name },
                (response: { roomCode?: string; playerId?: string; error?: string }) => {
                    if (response.error) {
                        callback?.(false, response.error);
                    } else {
                        setPlayerId(response.playerId || null);
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
        createRoom,
        joinRoom,
        startGame,
        requestRole,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
