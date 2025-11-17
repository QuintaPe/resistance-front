import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertModal, ConfirmModal } from "../components/ui";
import type { ModalContextType, ModalState } from "../types/modal";

/**
 * Contexto para gestionar modales globales de la aplicación
 * Proporciona funciones para mostrar alertas y confirmaciones
 */

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
                        <AlertModal
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
                        <ConfirmModal
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
