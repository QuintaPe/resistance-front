import React from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";

interface LoadingScreenProps {
    title: string;
    message: string;
    icon?: LucideIcon;
    showBackButton?: boolean;
    onBackClick?: () => void;
    backButtonText?: string;
}

/**
 * Pantalla de carga reutilizable con diseño táctico
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({
    title,
    message,
    icon: Icon,
    showBackButton = false,
    onBackClick,
    backButtonText = "Volver al inicio",
}) => {
    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden p-4">
            <AnimatedBackground />

            {/* Loading con diseño táctico */}
            <div className="relative z-10 w-full max-w-md animate-fadeIn">
                <div className="relative group">
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"></div>

                    <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                        {/* Icono de carga */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur-xl animate-pulse"></div>
                                <div className="relative w-16 h-16 rounded-lg flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
                                    {Icon ? (
                                        <Icon className="w-8 h-8 text-white" />
                                    ) : (
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Título con estilo dossier */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px flex-1 max-w-16 bg-linear-to-r from-transparent to-slate-500/50"></div>
                            <h2 className="text-lg font-black text-white uppercase tracking-wider">
                                {title}
                            </h2>
                            <div className="h-px flex-1 max-w-16 bg-linear-to-l from-transparent to-slate-500/50"></div>
                        </div>

                        <p className="text-center text-slate-400 text-sm font-medium mb-6">
                            {message}
                        </p>

                        {/* Botón opcional */}
                        {showBackButton && onBackClick && (
                            <button
                                onClick={onBackClick}
                                className="w-full px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-white rounded-lg font-semibold text-sm transition-colors"
                            >
                                {backButtonText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;

