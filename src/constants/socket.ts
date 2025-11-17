/**
 * Configuración del socket y eventos
 */

// URL del servidor (se puede sobreescribir con variable de entorno)
export const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3000";

// Configuración de reconexión
export const SOCKET_CONFIG = {
    transports: ["websocket", "polling"] as ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
};

// Eventos del socket (para evitar typos)
export const SOCKET_EVENTS = {
    // Conexión
    CONNECT: "connect",
    DISCONNECT: "disconnect",

    // Sala
    ROOM_CREATE: "room:create",
    ROOM_JOIN: "room:join",
    ROOM_UPDATE: "room:update",
    ROOM_CHANGE_LEADER: "room:changeLeader",

    // Juego
    GAME_START: "game:start",
    GAME_UPDATE: "game:update",
    GAME_ROLE: "game:role",
    GAME_REQUEST_ROLE: "game:requestRole",
    GAME_RESTART: "game:restart",
    GAME_RETURN_TO_LOBBY: "game:returnToLobby",

    // Equipo
    TEAM_PROPOSE: "team:propose",
    TEAM_VOTE: "team:vote",

    // Misión
    MISSION_ACT: "mission:act",

    // Jugadores
    PLAYER_DISCONNECTED: "player:disconnected",
    PLAYER_RECONNECTED: "player:reconnected",
    PLAYER_KICKED: "player:kicked",
    PLAYER_KICK: "player:kick",

    // Creador
    CREATOR_CHANGED: "creator:changed",
} as const;

