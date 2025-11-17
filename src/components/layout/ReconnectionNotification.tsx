import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { AlertCircle, CheckCircle, RefreshCw, Info } from "lucide-react";

/**
 * Componente que muestra notificaciones de reconexión/desconexión
 * Se posiciona en la parte superior de la pantalla siguiendo el diseño de la app
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

    // Configuración de estilos según el tipo - siguiendo el diseño de la app
    const getStyles = () => {
        if (isError) {
            return {
                bg: "bg-red-500/15",
                border: "border-red-500/40",
                iconBg: "bg-red-500/20",
                iconColor: "text-red-400",
                textColor: "text-red-300",
                icon: AlertCircle,
                progressBg: "bg-red-500/20",
                progressBar: "bg-red-500/60"
            };
        }
        if (isSuccess) {
            return {
                bg: "bg-green-500/15",
                border: "border-green-500/40",
                iconBg: "bg-green-500/20",
                iconColor: "text-green-400",
                textColor: "text-green-300",
                icon: CheckCircle,
                progressBg: "bg-green-500/20",
                progressBar: "bg-green-500/60"
            };
        }
        if (isWarning) {
            return {
                bg: "bg-yellow-500/15",
                border: "border-yellow-500/40",
                iconBg: "bg-yellow-500/20",
                iconColor: "text-yellow-400",
                textColor: "text-yellow-300",
                icon: RefreshCw,
                progressBg: "bg-yellow-500/20",
                progressBar: "bg-yellow-500/60"
            };
        }
        return {
            bg: "bg-blue-500/15",
            border: "border-blue-500/40",
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-400",
            textColor: "text-blue-300",
            icon: Info,
            progressBg: "bg-blue-500/20",
            progressBar: "bg-blue-500/60"
        };
    };

    const styles = getStyles();
    const IconComponent = styles.icon;

    // Determinar el texto a mostrar con validación
    const displayText = isReconnecting && !notification
        ? "Reconectando..."
        : notification || "";

    // No mostrar si no hay texto válido
    if (!displayText.trim()) {
        return null;
    }

    return (
        <div
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 
                        transition-all duration-300 ease-out
                        ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"}
                        pointer-events-none max-w-md w-full px-4`}
            role="alert"
            aria-live="polite"
        >
            {/* Efecto de brillo al hover */}
            <div className="relative group">
                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isError
                    ? "bg-linear-to-r from-red-500/0 via-red-500/20 to-red-500/0"
                    : isSuccess
                        ? "bg-linear-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                        : isWarning
                            ? "bg-linear-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0"
                            : "bg-linear-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0"
                    }`}></div>

                {/* Card de notificación */}
                <div className={`
                    relative backdrop-blur-sm rounded-lg p-3 
                    transition-all duration-300
                    ${styles.bg}
                    border ${styles.border}
                    shadow-2xl
                `}>
                    <div className="flex items-center gap-3">
                        {/* Icono */}
                        <div className="shrink-0">
                            <div className={`p-1.5 ${styles.iconBg} rounded`}>
                                <IconComponent
                                    className={`w-4 h-4 ${styles.iconColor} ${isReconnecting ? 'animate-spin' : ''}`}
                                />
                            </div>
                        </div>

                        {/* Texto */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${styles.textColor}`}>
                                {displayText}
                            </p>
                        </div>
                    </div>

                    {/* Barra de progreso para reconexión */}
                    {isReconnecting && (
                        <div className="mt-2.5">
                            <div className={`w-full h-1.5 ${styles.progressBg} rounded-full overflow-hidden`}>
                                <div className={`h-full ${styles.progressBar} animate-progress-bar`}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReconnectionNotification;

