import React from "react";
import Modal from "./Modal";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: "info" | "success" | "error" | "warning";
    confirmText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = "info",
    confirmText = "Aceptar",
}) => {
    const iconConfig = {
        info: {
            icon: Info,
            color: "text-blue-400",
            bg: "bg-blue-500",
            variant: "default" as const,
        },
        success: {
            icon: CheckCircle,
            color: "text-green-400",
            bg: "bg-green-500",
            variant: "success" as const,
        },
        error: {
            icon: AlertCircle,
            color: "text-red-400",
            bg: "bg-red-500",
            variant: "error" as const,
        },
        warning: {
            icon: AlertTriangle,
            color: "text-yellow-400",
            bg: "bg-yellow-500",
            variant: "warning" as const,
        },
    };

    const config = iconConfig[type];
    const Icon = config.icon;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            variant={config.variant}
            showCloseButton={false}
        >
            <div className="space-y-4">
                {/* Icono */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div
                            className={`absolute inset-0 ${config.bg}/30 rounded-lg blur-xl animate-pulse`}
                        ></div>
                        <div
                            className={`relative w-14 h-14 rounded-lg flex items-center justify-center bg-linear-to-br ${config.bg} ${config.bg}/80`}
                        >
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>

                {/* Título */}
                {title && (
                    <h3 className="text-lg font-bold text-white text-center">
                        {title}
                    </h3>
                )}

                {/* Mensaje */}
                <p className="text-slate-300 text-center text-sm leading-relaxed">
                    {message}
                </p>

                {/* Botón */}
                <button
                    onClick={onClose}
                    className="w-full relative group overflow-hidden rounded-lg"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-slate-600 to-slate-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative px-4 py-2.5 text-white font-bold text-sm">
                        {confirmText}
                    </div>
                </button>
            </div>
        </Modal>
    );
};

export default AlertModal;

