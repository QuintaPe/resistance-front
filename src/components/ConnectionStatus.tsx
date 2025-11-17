import React from "react";
import { useSocket } from "../context/SocketContext";
import { Wifi, WifiOff } from "lucide-react";

/**
 * Indicador visual del estado de conexión
 * Se muestra en la esquina inferior derecha
 */
export const ConnectionStatus: React.FC = () => {
    const { connected, isReconnecting } = useSocket();

    return (
        <div className="fixed bottom-4 right-4 z-40">
            <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300
                    ${isReconnecting
                        ? "bg-yellow-500/20 border border-yellow-500/50"
                        : connected
                            ? "bg-green-500/20 border border-green-500/50"
                            : "bg-red-500/20 border border-red-500/50"
                    }`}
            >
                {isReconnecting ? (
                    <>
                        <Wifi className="w-4 h-4 text-yellow-400 animate-pulse" />
                        <span className="text-xs font-medium text-yellow-300">Reconectando...</span>
                    </>
                ) : connected ? (
                    <>
                        <Wifi className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-medium text-green-300">Conectado</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-medium text-red-300">Desconectado</span>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConnectionStatus;

