import { useMemo } from "react";
import { useSocket } from "../context/SocketContext";

/**
 * Hook que determina si el jugador actual es el creador de la sala
 */
export const useIsCreator = (): boolean => {
    const { roomState, playerId } = useSocket();

    return useMemo(() => {
        return roomState?.creatorId === playerId;
    }, [roomState?.creatorId, playerId]);
};

