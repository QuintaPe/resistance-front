/**
 * Constantes del juego - The Resistance
 * Todas las configuraciones y valores fijos del juego
 */

// Límites de jugadores
export const MIN_PLAYERS = 5;
export const MAX_PLAYERS = 12;

// Límites de rechazos de equipos
export const MAX_TEAM_REJECTIONS = 5;
export const WARNING_REJECTIONS = 3;

// Fases del juego
export const GAME_PHASES = {
    LOBBY: "lobby",
    PROPOSE_TEAM: "proposeTeam",
    VOTE_TEAM: "voteTeam",
    MISSION: "mission",
    REVEAL: "reveal",
} as const;

// Roles del juego
export const ROLES = {
    SPY: "spy",
    RESISTANCE: "resistance",
} as const;

// Misiones
export const TOTAL_MISSIONS = 5;
export const MISSIONS_TO_WIN = 3;

// Tiempos (en milisegundos)
export const TIMINGS = {
    NOTIFICATION_DURATION: 5000,
    SUCCESS_NOTIFICATION: 3000,
    REDIRECT_DELAY: 1000,
    COPY_FEEDBACK: 2000,
};

// Límites de texto
export const TEXT_LIMITS = {
    PLAYER_NAME: 20,
    ROOM_CODE: 5,
};

