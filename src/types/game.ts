/**
 * Tipos relacionados con el estado del juego
 */

import type { Player } from "./player";
import type { MissionResult } from "./mission";

export type GamePhase = "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";

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

export type GameRoleData = {
    role: "spy" | "resistance";
    spies?: string[];   // Solo visible para espías
};

