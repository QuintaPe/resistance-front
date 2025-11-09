import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useGame } from "../hooks/useGame";
import { useSocket } from "../context/SocketContext";
import TeamSelector from "../components/TeamSelector";
import VoteButtons from "../components/VoteButtons";
import MissionAction from "../components/MissionAction";
import MissionTracker from "../components/MissionTracker";
import GameStatus from "../components/GameStatus";

const Game: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();

    const {
        roomState,
        isLeader,
        isInTeam,
        phase,
        teamSize,
        proposeTeam,
        voteTeam,
        missionAct,
    } = useGame();

    // Necesitamos role y spies (privado) para mostrar info a los espías
    const { role, spies, playerId, requestRole } = useSocket();

    const [selectedTeam, setSelectedTeam] = useState<string[]>([]);

    // Solicitar rol si el juego ya comenzó pero no tenemos rol
    useEffect(() => {
        if (roomCode && roomState && phase !== "lobby" && !role) {
            console.log("⚠️ Solicitando rol porque no lo tenemos");
            requestRole(roomCode);
        }
    }, [roomCode, roomState, phase, role, requestRole]);

    // Lista de nombres de otros espías (si eres espía)
    const otherSpiesNames = useMemo(() => {
        if (!roomState || role !== "spy" || !spies || spies.length === 0) return [];
        // spies contiene IDs; mapear a nombres en players
        return spies
            .filter((id) => id !== playerId) // excluirte a ti
            .map((id) => roomState.players.find((p) => p.id === id)?.name || id);
    }, [role, spies, playerId, roomState]);

    if (!roomState) {
        return (
            <div className="flex h-screen items-center justify-center">
                Cargando juego...
            </div>
        );
    }

    // Si el juego terminó, redirigir a la pantalla Reveal
    if (phase === "reveal" && roomCode) {
        navigate(`/reveal/${roomCode}`);
    }

    // =========================
    // Funciones locales
    // =========================
    const handlePropose = () => {
        if (!roomCode) return;
        if (selectedTeam.length !== teamSize) return;
        proposeTeam(roomCode, selectedTeam);
        setSelectedTeam([]);
    };

    const handleVote = (vote: "approve" | "reject") => {
        if (!roomCode) return;
        voteTeam(roomCode, vote);
    };

    const handleMission = (action: "success" | "fail") => {
        if (!roomCode) return;
        missionAct(roomCode, action);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-6 gap-6">
            <h1 className="text-2xl font-bold mb-2">Sala: {roomState.code}</h1>

            {/* Tracker de misiones */}
            <MissionTracker total={5} results={roomState.results} />

            {/* Resultado de la última misión */}
            {roomState.results.length > 0 && (
                <div className={`border-2 p-4 rounded-lg w-96 ${roomState.results[roomState.results.length - 1].passed
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                    }`}>
                    <h3 className="font-bold text-lg mb-2">
                        {roomState.results[roomState.results.length - 1].passed
                            ? "✅ Última Misión: ÉXITO"
                            : "❌ Última Misión: FRACASO"}
                    </h3>
                    <p className="text-sm">
                        <strong>Equipo:</strong>{" "}
                        {roomState.results[roomState.results.length - 1].team
                            .map((pid) => roomState.players.find((p) => p.id === pid)?.name || pid)
                            .join(", ")}
                    </p>
                    {roomState.results[roomState.results.length - 1].fails > 0 && (
                        <p className="text-sm mt-1">
                            <strong>Votos de Fallo:</strong> {roomState.results[roomState.results.length - 1].fails}
                        </p>
                    )}
                </div>
            )}

            {/* Estado general */}
            <GameStatus
                leader={roomState.players[roomState.leaderIndex].name}
                phase={phase}
                rejectedTeams={roomState.rejectedTeamsInRow}
            />

            {/* Mostrar tu rol PRIVADO en algún lugar (opcional) */}
            <div className="text-sm text-gray-700 border p-3 rounded bg-gray-50">
                {role ? (
                    <div>
                        Tu rol: <strong className={role === "spy" ? "text-red-600" : "text-blue-600"}>
                            {role === "spy" ? "🕵️ Espía" : "🛡️ Resistencia"}
                        </strong>
                        {role === "spy" && otherSpiesNames.length > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                                Tus compañeros espías: {otherSpiesNames.join(", ")}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-xs text-red-500 font-semibold">⚠️ Aún no recibiste tu rol</div>
                )}
            </div>

            {/* Render por fase */}
            {phase === "proposeTeam" && (
                <div className="flex flex-col items-center gap-4">
                    {isLeader ? (
                        <>
                            <p>Selecciona {teamSize} jugadores para la misión:</p>
                            <TeamSelector
                                players={roomState.players}
                                selectedTeam={selectedTeam}
                                setSelectedTeam={setSelectedTeam}
                                teamSize={teamSize}
                            />
                            <button
                                onClick={handlePropose}
                                className={`p-2 rounded text-white ${selectedTeam.length === teamSize
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                disabled={selectedTeam.length !== teamSize}
                            >
                                Proponer Equipo
                            </button>
                        </>
                    ) : (
                        <p>Esperando que el líder seleccione el equipo...</p>
                    )}
                </div>
            )}

            {phase === "voteTeam" && (
                <div className="flex flex-col items-center gap-4">
                    <p className="font-semibold text-lg">Equipo propuesto:</p>
                    <ul className="mb-2">
                        {roomState.proposedTeam.map((pid) => {
                            const player = roomState.players.find((p) => p.id === pid);
                            return <li key={pid}>{player?.name || pid}</li>;
                        })}
                    </ul>
                    <p className="text-sm text-gray-600">Todos los jugadores deben votar:</p>
                    <VoteButtons onVote={handleVote} />
                </div>
            )}

            {phase === "mission" && (
                <div className="flex flex-col items-center gap-4">
                    {isInTeam ? (
                        <>
                            {console.log("🎮 Fase misión - Role:", role, "canFail:", role === "spy")}
                            <MissionAction
                                canFail={role === "spy"} // Solo si tu rol es spy verás la opción de Fallo
                                onAction={handleMission}
                            />
                        </>
                    ) : (
                        <p>Esperando que el equipo complete la misión...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Game;
