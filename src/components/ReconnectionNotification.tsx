import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

/**
 * Componente que muestra notificaciones de reconexión/desconexión
 * Se posiciona en la parte superior de la pantalla
 */
export const ReconnectionNotification: React.FC = () => {
    const { notification, isReconnecting } = useSocket();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (notification || isReconnecting) {
            setShow(true);
        } else {
            // Pequeño delay antes de ocultar para animación
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [notification, isReconnecting]);

    if (!show && !notification && !isReconnecting) {
        return null;
    }

    // Determinar el tipo de notificación
    const isError = notification?.includes("No se pudo") || notification?.includes("Error");
    const isSuccess = notification?.includes("✅") || notification?.includes("exitosamente");
    const isWarning = notification?.includes("desconectado") || isReconnecting;

    const bgColor = isError
        ? "bg-red-500"
        : isSuccess
            ? "bg-green-500"
            : isWarning
                ? "bg-yellow-500"
                : "bg-blue-500";

    const displayText = isReconnecting && !notification
        ? "🔄 Reconectando..."
        : notification;

    return (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
                        ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg
                        transition-all duration-300 ease-in-out
                        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                        max-w-md text-center font-medium`}
            role="alert"
        >
            {displayText}
        </div>
    );
};

export default ReconnectionNotification;

