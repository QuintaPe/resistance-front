/**
 * Tipos relacionados con Socket.IO
 */

export type SocketResponse<T = Record<string, unknown>> = T & {
    error?: string;
    success?: boolean;
};

export type CreateRoomResponse = SocketResponse<{
    roomCode: string;
    playerId: string;
    sessionId: string;
}>;

export type JoinRoomResponse = SocketResponse<{
    roomCode?: string;
    playerId?: string;
    sessionId?: string;
    reconnected?: boolean;
}>;

