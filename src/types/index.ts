/**
 * Exportaciones centralizadas de tipos
 * Punto de entrada único para importar tipos en toda la aplicación
 */

// Tipos de jugador
export type { Player, Role } from "./player";

// Tipos de misión
export type { MissionResult } from "./mission";

// Tipos de juego
export type { GamePhase, PublicState, GameRoleData } from "./game";

// Tipos de socket
export type {
    SocketResponse,
    CreateRoomResponse,
    JoinRoomResponse
} from "./socket";

// Tipos de notificación
export type { NotificationType, PlayerNotification } from "./notification";

