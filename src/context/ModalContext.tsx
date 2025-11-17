import React, { createContext, useContext, useState, useCallback } from "react";

interface ModalContextType {
    showAlert: (message: string, type?: "info" | "success" | "error" | "warning", title?: string) => void;
    showConfirm: (
        message: string,
        onConfirm: () => void,
        title?: string,
        confirmText?: string
    ) => void;
}

interface ModalState {
    type: "alert" | "confirm" | null;
    message: string;
    title?: string;
    alertType?: "info" | "success" | "error" | "warning";
    confirmText?: string;
    onConfirm?: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [modalState, setModalState] = useState<ModalState>({
        type: null,
        message: "",
    });

    const showAlert = useCallback(
        (
            message: string,
            type: "info" | "success" | "error" | "warning" = "info",
            title?: string
        ) => {
            setModalState({
                type: "alert",
                message,
                title,
                alertType: type,
            });
        },
        []
    );

    const showConfirm = useCallback(
        (
            message: string,
            onConfirm: () => void,
            title?: string,
            confirmText?: string
        ) => {
            setModalState({
                type: "confirm",
                message,
                title,
                confirmText,
                onConfirm,
            });
        },
        []
    );

    const closeModal = useCallback(() => {
        setModalState({ type: null, message: "" });
    }, []);

    const handleConfirm = useCallback(() => {
        if (modalState.onConfirm) {
            modalState.onConfirm();
        }
        closeModal();
    }, [modalState, closeModal]);

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm }}>
            {children}

            {/* Alert Modal */}
            {modalState.type === "alert" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={closeModal}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                    <div
                        className="relative w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AlertModalContent
                            message={modalState.message}
                            title={modalState.title}
                            type={modalState.alertType || "info"}
                            onClose={closeModal}
                        />
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {modalState.type === "confirm" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={closeModal}
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
                    <div
                        className="relative w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ConfirmModalContent
                            message={modalState.message}
                            title={modalState.title || "Confirmar acción"}
                            confirmText={modalState.confirmText || "Confirmar"}
                            onConfirm={handleConfirm}
                            onClose={closeModal}
                        />
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

// Componentes internos
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface AlertModalContentProps {
    message: string;
    title?: string;
    type: "info" | "success" | "error" | "warning";
    onClose: () => void;
}

const AlertModalContent: React.FC<AlertModalContentProps> = ({
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

interface ConfirmModalContentProps {
    message: string;
    title: string;
    confirmText: string;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmModalContent: React.FC<ConfirmModalContentProps> = ({
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

