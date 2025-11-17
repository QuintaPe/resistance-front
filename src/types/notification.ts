/**
 * Tipos relacionados con notificaciones
 */

export type NotificationType = "info" | "success" | "error" | "warning";

export type PlayerNotification = {
    playerId: string;
    message: string;
    isTemporary?: boolean;
};

