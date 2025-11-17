/**
 * Tipos compartidos del proyecto
 * Definiciones de tipos para el juego The Resistance
 */

// =========================
// 👤 Tipos de Jugador
// =========================

export type Player = {
    id: string;
    name: string;
};

export type Role = "spy" | "resistance";

// =========================
// 🎯 Tipos de Misión
// =========================

export type MissionResult = {
    team: string[];      // IDs de jugadores en el equipo
    fails: number;       // Número de votos para fallar la misión
    passed: boolean;     // Si la misión fue exitosa
};

// =========================
// 🎮 Tipos de Fase del Juego
// =========================

export type GamePhase = "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";

// =========================
// 📊 Estado Público del Juego
// =========================

export type PublicState = {
    code: string;                       // Código de la sala
    players: Player[];                  // Lista de jugadores en la sala
    creatorId: string;                  // ID del creador de la sala (permisos especiales)
    phase: GamePhase;                   // Fase actual del juego
    leaderIndex: number;                // Índice del líder actual en el array de jugadores
    currentMission: number;             // Índice de la misión actual (0-4)
    teamSizePerMission: number[];       // Tamaños de equipo requeridos por misión
    failsRequired: number[];            // Fallos necesarios para que falle cada misión
    proposedTeam: string[];             // IDs de jugadores en el equipo propuesto
    results: MissionResult[];           // Resultados de misiones completadas
    rejectedTeamsInRow: number;         // Rechazos consecutivos (máx 5)
    votedPlayers?: string[];            // IDs de jugadores que ya votaron (fase voteTeam)
    playersActed?: string[];            // IDs de jugadores que ya actuaron (fase mission)
};

// =========================
// 🔌 Tipos de Socket
// =========================

export type SocketResponse<T = Record<string, unknown>> = T & {
    error?: string;
    success?: boolean;
};

export type CreateRoomResponse = SocketResponse<{
    roomCode: string;
    playerId: string;
    sessionId: string;
}>;

export type JoinRoomResponse = SocketResponse<{
    roomCode?: string;
    playerId?: string;
    sessionId?: string;
    reconnected?: boolean;
}>;

export type GameRoleData = {
    role: Role;
    spies?: string[];   // Solo visible para espías
};

// =========================
// 📢 Tipos de Notificaciones
// =========================

export type NotificationType = "info" | "success" | "error" | "warning";

export type PlayerNotification = {
    playerId: string;
    message: string;
    isTemporary?: boolean;
};
