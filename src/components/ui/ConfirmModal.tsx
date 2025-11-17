import React from "react";
import { AlertTriangle } from "lucide-react";
import type { ConfirmModalProps } from "../../types/modal";

/**
 * Componente de modal de confirmación
 * Muestra un mensaje con botones de confirmar y cancelar
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    message,
    title,
    confirmText,
    onConfirm,
    onClose,
}) => {
    return (
        <>
            <div className="absolute inset-0 rounded-xl opacity-50 blur-2xl bg-yellow-500/30"></div>
            <div className="relative backdrop-blur-xl rounded-xl shadow-2xl border-2 bg-yellow-500/15 border-yellow-500/40 p-6">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500/30 rounded-lg blur-xl animate-pulse"></div>
                            <div className="relative w-14 h-14 rounded-lg flex items-center justify-center bg-linear-to-br from-yellow-500 to-yellow-600">
                                <AlertTriangle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-white text-center">
                        {title}
                    </h3>

                    <p className="text-slate-300 text-center text-sm leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 relative group overflow-hidden rounded-lg"
                        >
                            <div className="absolute inset-0 bg-slate-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative px-4 py-2.5 text-white font-bold text-sm">
                                Cancelar
                            </div>
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 relative group overflow-hidden rounded-lg"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-red-600 to-red-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative px-4 py-2.5 text-white font-bold text-sm">
                                {confirmText}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

