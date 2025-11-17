import type { PublicState, MissionResult } from "../types";
import { MISSIONS_TO_WIN, MAX_TEAM_REJECTIONS } from "../constants";

/**
 * Determina el ganador del juego basado en el estado
 */
export const determineWinner = (
    roomState: PublicState | null
): "spies" | "resistance" | null => {
    if (!roomState) return null;

    const passed = roomState.results.filter((r) => r.passed).length;
    const failed = roomState.results.filter((r) => !r.passed).length;

    // Los espías ganan si hay 5 rechazos seguidos
    if (roomState.rejectedTeamsInRow >= MAX_TEAM_REJECTIONS) return "spies";

    // La resistencia gana con 3 misiones exitosas
    if (passed >= MISSIONS_TO_WIN) return "resistance";

    // Los espías ganan con 3 misiones fallidas
    if (failed >= MISSIONS_TO_WIN) return "spies";

    return null;
};

/**
 * Verifica si el juego ha terminado
 */
export const isGameEnded = (phase: string): boolean => {
    return phase === "reveal";
};

/**
 * Obtiene el tamaño del equipo para la misión actual
 */
export const getCurrentTeamSize = (
    roomState: PublicState | null
): number => {
    if (!roomState?.teamSizePerMission) return 0;
    return roomState.teamSizePerMission[roomState.currentMission || 0] ?? 0;
};

/**
 * Obtiene el progreso de misiones completadas
 */
export const getMissionProgress = (roomState: PublicState | null): number => {
    return roomState?.results?.length ?? 0;
};

/**
 * Verifica si un jugador es el líder actual
 */
export const isPlayerLeader = (
    roomState: PublicState | null,
    playerId: string | null
): boolean => {
    if (!roomState || !playerId) return false;
    return roomState.players[roomState.leaderIndex]?.id === playerId;
};

/**
 * Verifica si un jugador está en el equipo propuesto
 */
export const isPlayerInTeam = (
    roomState: PublicState | null,
    playerId: string | null
): boolean => {
    if (!roomState || !playerId) return false;
    return roomState.proposedTeam?.includes(playerId) ?? false;
};

/**
 * Verifica si un jugador es el creador de la sala
 */
export const isPlayerCreator = (
    roomState: PublicState | null,
    playerId: string | null
): boolean => {
    if (!roomState || !playerId) return false;
    return roomState.creatorId === playerId;
};

/**
 * Obtiene los nombres de los jugadores en el equipo propuesto
 */
export const getProposedTeamNames = (
    roomState: PublicState | null
): string[] => {
    if (!roomState?.proposedTeam) return [];

    return roomState.proposedTeam
        .map(playerId => roomState.players.find(p => p.id === playerId)?.name)
        .filter((name): name is string => name !== undefined);
};

/**
 * Obtiene el nombre del líder actual
 */
export const getLeaderName = (roomState: PublicState | null): string => {
    if (!roomState) return "Desconocido";
    return roomState.players[roomState.leaderIndex]?.name || "Desconocido";
};

/**
 * Cuenta cuántas misiones han pasado y cuántas han fallado
 */
export const getMissionStats = (
    results: MissionResult[]
): { passed: number; failed: number } => {
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    return { passed, failed };
};

/**
 * Verifica si se puede iniciar el juego (mínimo de jugadores alcanzado)
 */
export const canStartGame = (
    playerCount: number,
    isLeader: boolean
): boolean => {
    return playerCount >= 5 && isLeader;
};

/**
 * Formatea el código de sala para mostrar (mayúsculas)
 */
export const formatRoomCode = (code: string): string => {
    return code.toUpperCase().trim();
};

