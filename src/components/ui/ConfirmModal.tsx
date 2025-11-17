import React from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "error" | "warning";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar acción",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "warning",
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            variant={variant}
            showCloseButton={false}
        >
            <div className="space-y-4">
                {/* Icono de advertencia */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/30 rounded-lg blur-xl animate-pulse"></div>
                        <div className="relative w-14 h-14 rounded-lg flex items-center justify-center bg-linear-to-br from-yellow-500 to-yellow-600">
                            <AlertTriangle className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-white text-center">
                    {title}
                </h3>

                {/* Mensaje */}
                <p className="text-slate-300 text-center text-sm leading-relaxed">
                    {message}
                </p>

                {/* Botones */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 relative group overflow-hidden rounded-lg"
                    >
                        <div className="absolute inset-0 bg-slate-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative px-4 py-2.5 text-white font-bold text-sm">
                            {cancelText}
                        </div>
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 relative group overflow-hidden rounded-lg"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-red-600 to-red-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative px-4 py-2.5 text-white font-bold text-sm">
                            {confirmText}
                        </div>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;

