import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "success" | "error" | "warning";
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    showCloseButton = true,
    size = "md",
    variant = "default",
}) => {
    // Manejar tecla Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevenir scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
    };

    const variantStyles = {
        default: {
            border: "border-slate-700/50",
            bg: "bg-slate-800/40",
            glow: "bg-blue-500/30",
        },
        success: {
            border: "border-green-500/40",
            bg: "bg-green-500/15",
            glow: "bg-green-500/30",
        },
        error: {
            border: "border-red-500/40",
            bg: "bg-red-500/15",
            glow: "bg-red-500/30",
        },
        warning: {
            border: "border-yellow-500/40",
            bg: "bg-yellow-500/15",
            glow: "bg-yellow-500/30",
        },
    };

    const styles = variantStyles[variant];

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            {/* Modal */}
            <div
                className={`relative w-full ${sizeClasses[size]}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Efecto de brillo */}
                <div
                    className={`absolute inset-0 rounded-xl opacity-50 blur-2xl ${styles.glow}`}
                ></div>

                <div
                    className={`relative backdrop-blur-xl rounded-xl shadow-2xl border-2 transition-all duration-300 ${styles.bg} ${styles.border}`}
                >
                    {/* Header (opcional) */}
                    {(title || showCloseButton) && (
                        <div className="p-5 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                {title && (
                                    <h2 className="text-xl font-bold text-white">
                                        {title}
                                    </h2>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="w-8 h-8 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center hover:bg-slate-700/60 transition-colors ml-auto"
                                        aria-label="Cerrar"
                                    >
                                        <X className="w-5 h-5 text-slate-300" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-5">{children}</div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;

