import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import type { AlertModalProps } from "../../types/modal";

/**
 * Componente de modal de alerta
 * Muestra un mensaje con un tipo específico (info, success, error, warning)
 */
export const AlertModal: React.FC<AlertModalProps> = ({
    message,
    title,
    type,
    onClose,
}) => {
    const iconConfig = {
        info: {
            icon: Info,
            bg: "bg-blue-500",
            border: "border-blue-500/40",
            bgModal: "bg-blue-500/15",
        },
        success: {
            icon: CheckCircle,
            bg: "bg-green-500",
            border: "border-green-500/40",
            bgModal: "bg-green-500/15",
        },
        error: {
            icon: AlertCircle,
            bg: "bg-red-500",
            border: "border-red-500/40",
            bgModal: "bg-red-500/15",
        },
        warning: {
            icon: AlertTriangle,
            bg: "bg-yellow-500",
            border: "border-yellow-500/40",
            bgModal: "bg-yellow-500/15",
        },
    };

    const config = iconConfig[type];
    const Icon = config.icon;

    return (
        <>
            <div
                className={`absolute inset-0 rounded-xl opacity-50 blur-2xl ${config.bg}/30`}
            ></div>
            <div
                className={`relative backdrop-blur-xl rounded-xl shadow-2xl border-2 ${config.bgModal} ${config.border} p-6`}
            >
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div
                                className={`absolute inset-0 ${config.bg}/30 rounded-lg blur-xl animate-pulse`}
                            ></div>
                            <div
                                className={`relative w-14 h-14 rounded-lg flex items-center justify-center bg-linear-to-br ${config.bg}`}
                            >
                                <Icon className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>

                    {title && (
                        <h3 className="text-lg font-bold text-white text-center">
                            {title}
                        </h3>
                    )}

                    <p className="text-slate-300 text-center text-sm leading-relaxed">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full relative group overflow-hidden rounded-lg"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-slate-600 to-slate-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative px-4 py-2.5 text-white font-bold text-sm">
                            Aceptar
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
};

