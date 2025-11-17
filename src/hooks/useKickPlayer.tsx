import { useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useModal } from "../context/ModalContext";

/**
 * Hook que proporciona una función para expulsar jugadores con confirmación
 */
export const useKickPlayer = () => {
    const { kickPlayer } = useSocket();
    const { showAlert, showConfirm } = useModal();

    const handleKickPlayer = useCallback(
        (roomCode: string, targetPlayerId: string, playerName: string) => {
            if (!roomCode) return;

            showConfirm(
                `¿Estás seguro de expulsar a ${playerName}?`,
                () => {
                    kickPlayer(roomCode, targetPlayerId, (ok, error) => {
                        if (!ok && error) {
                            showAlert(error, "error", "Error al expulsar");
                        }
                    });
                },
                "Expulsar jugador",
                "Expulsar"
            );
        },
        [kickPlayer, showAlert, showConfirm]
    );

    return handleKickPlayer;
};

