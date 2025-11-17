import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";

/**
 * Hook que escucha cuando el jugador es expulsado de la sala
 * y lo redirige automáticamente a la página de inicio
 */
export const useKickedListener = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();

    useEffect(() => {
        const handleKicked = () => {
            navigate("/");
        };

        socket.on("player:kicked", handleKicked);

        return () => {
            socket.off("player:kicked", handleKicked);
        };
    }, [socket, navigate]);
};

