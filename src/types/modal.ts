/**
 * Tipos para el sistema de modales
 */

export type ModalAlertType = "info" | "success" | "error" | "warning";

export interface ModalContextType {
    showAlert: (message: string, type?: ModalAlertType, title?: string) => void;
    showConfirm: (
        message: string,
        onConfirm: () => void,
        title?: string,
        confirmText?: string
    ) => void;
}

export interface ModalState {
    type: "alert" | "confirm" | null;
    message: string;
    title?: string;
    alertType?: ModalAlertType;
    confirmText?: string;
    onConfirm?: () => void;
}

export interface AlertModalProps {
    message: string;
    title?: string;
    type: ModalAlertType;
    onClose: () => void;
}

export interface ConfirmModalProps {
    message: string;
    title: string;
    confirmText: string;
    onConfirm: () => void;
    onClose: () => void;
}

