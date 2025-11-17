import { useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { SOCKET_EVENTS } from "../constants";
import {
    determineWinner,
    isGameEnded,
    getCurrentTeamSize,
    getMissionProgress,
    isPlayerLeader,
    isPlayerInTeam,
} from "../utils";

/**
 * Hook principal para gestionar las acciones del juego
 * (proponer equipo, votar, actuar en misión, etc.)
 */
export const useGame = () => {
    const { socket, roomState, playerId } = useSocket();

    // =========================
    // 📡 EVENTOS SOCKET
    // =========================

    /** Proponer un equipo (solo líder) */
    const proposeTeam = useCallback(
        (roomCode: string, teamIds: string[]) => {
            if (!roomCode || !teamIds.length) return;
            socket.emit(SOCKET_EVENTS.TEAM_PROPOSE, { roomCode, teamIds });
        },
        [socket]
    );

    /** Votar por un equipo */
    const voteTeam = useCallback(
        (roomCode: string, vote: "approve" | "reject") => {
            if (!roomCode) return;
            socket.emit(SOCKET_EVENTS.TEAM_VOTE, { roomCode, vote });
        },
        [socket]
    );

    /** Actuar en una misión */
    const missionAct = useCallback(
        (roomCode: string, action: "success" | "fail") => {
            if (!roomCode) return;
            socket.emit(SOCKET_EVENTS.MISSION_ACT, { roomCode, action });
        },
        [socket]
    );

    // =========================
    // 🧠 UTILIDADES DEL ESTADO
    // =========================

    /** Jugador actual es el líder */
    const isLeader = isPlayerLeader(roomState, playerId);

    /** Jugador actual está en el equipo propuesto */
    const isInTeam = isPlayerInTeam(roomState, playerId);

    /** Fase actual del juego */
    const phase = roomState?.phase ?? "lobby";

    /** Tamaño del equipo requerido para la misión actual */
    const teamSize = getCurrentTeamSize(roomState);

    /** Progreso de misiones (para barra de estado o visual) */
    const missionProgress = getMissionProgress(roomState);

    /** Verifica si el juego ha terminado */
    const gameEnded = isGameEnded(phase);

    /** Determina quién ganó */
    const winner = determineWinner(roomState);

    // =========================
    // 🚀 API del Hook
    // =========================

    return {
        // Estado base
        roomState,
        playerId,
        phase,
        teamSize,
        missionProgress,
        isLeader,
        isInTeam,
        gameEnded,
        winner,

        // Acciones
        proposeTeam,
        voteTeam,
        missionAct,
    };
};

export default useGame;
