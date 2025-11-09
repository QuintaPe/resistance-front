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
        return spies
            .filter((id) => id !== playerId)
            .map((id) => roomState.players.find((p) => p.id === id)?.name || id);
    }, [role, spies, playerId, roomState]);

    if (!roomState) {
        return (
            <div className="loading-screen">
                <div className="animate-pulse">
                    <div className="text-4xl mb-4">🎮</div>
                    <div>Cargando juego...</div>
                </div>
            </div>
        );
    }

    // Si el juego terminó, redirigir a la pantalla Reveal
    if (phase === "reveal" && roomCode) {
        navigate(`/reveal/${roomCode}`);
    }

    const handlePropose = () => {
        if (!roomCode || selectedTeam.length !== teamSize) return;
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
        <div className="min-h-screen p-3 sm:p-6 animate-fadeIn">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-3 sm:space-y-6">
                {/* Header con código de sala */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {roomState.code}
                    </h1>
                    <div className="badge bg-slate-700 text-slate-300 text-xs">
                        Misión {roomState.currentMission + 1}/5
                    </div>
                </div>

                {/* Tracker de misiones - Scrollable en móvil */}
                <div className="card-glow">
                    <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center">Progreso de Misiones</h2>
                    <div className="overflow-x-auto flex justify-center pb-2">
                        <MissionTracker total={5} results={roomState.results} />
                    </div>
                </div>

                {/* Layout responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
                    {/* Columna izquierda: Estado e información */}
                    <div className="lg:col-span-1 space-y-3 sm:space-y-6 order-2 lg:order-1">
                        {/* Estado del juego */}
                        <div className="card">
                            <GameStatus
                                leader={roomState.players[roomState.leaderIndex].name}
                                phase={phase}
                                rejectedTeams={roomState.rejectedTeamsInRow}
                            />
                        </div>

                        {/* Tu rol */}
                        <div className={`card ${role === "spy" ? "border-red-500/50 bg-red-500/5" : "border-blue-500/50 bg-blue-500/5"}`}>
                            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3">Tu Rol</h3>
                            {role ? (
                                <div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-base sm:text-lg ${role === "spy"
                                        ? "bg-gradient-to-r from-red-600 to-red-700"
                                        : "bg-gradient-to-r from-blue-600 to-blue-700"
                                        }`}>
                                        <span className="text-lg sm:text-xl">{role === "spy" ? "🕵️" : "🛡️"}</span>
                                        <span>{role === "spy" ? "Espía" : "Resistencia"}</span>
                                    </div>
                                    {role === "spy" && otherSpiesNames.length > 0 && (
                                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-300 bg-red-500/10 p-2 sm:p-3 rounded-lg">
                                            <div className="font-semibold mb-1">Compañeros espías:</div>
                                            <div>{otherSpiesNames.join(", ")}</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-yellow-400 flex items-center gap-2 text-sm">
                                    <span className="animate-pulse">⚠️</span>
                                    <span>Aún no recibiste tu rol</span>
                                </div>
                            )}
                        </div>

                        {/* Resultado de la última misión */}
                        {roomState.results.length > 0 && (
                            <div className={`card ${roomState.results[roomState.results.length - 1].passed
                                ? "border-green-500/50 bg-green-500/5"
                                : "border-red-500/50 bg-red-500/5"
                                }`}>
                                <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3">Última Misión</h3>
                                <div className="space-y-2">
                                    <div className={`text-lg sm:text-xl font-bold ${roomState.results[roomState.results.length - 1].passed
                                        ? "text-green-400"
                                        : "text-red-400"
                                        }`}>
                                        {roomState.results[roomState.results.length - 1].passed
                                            ? "✅ ÉXITO"
                                            : "❌ FRACASO"}
                                    </div>
                                    <div className="text-xs sm:text-sm text-slate-400">
                                        <strong>Equipo:</strong>{" "}
                                        {roomState.results[roomState.results.length - 1].team
                                            .map((pid) => roomState.players.find((p) => p.id === pid)?.name || pid)
                                            .join(", ")}
                                    </div>
                                    {roomState.results[roomState.results.length - 1].fails > 0 && (
                                        <div className="text-xs sm:text-sm text-red-300">
                                            <strong>Votos de Fallo:</strong> {roomState.results[roomState.results.length - 1].fails}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha: Área de juego principal */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <div className="card-glow min-h-[300px] sm:min-h-[400px] flex flex-col">
                            {/* Fase: Proponer equipo */}
                            {phase === "proposeTeam" && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-4 sm:space-y-6 p-2 sm:p-4">
                                    {isLeader ? (
                                        <>
                                            <div className="text-center">
                                                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">👥</div>
                                                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Selecciona tu Equipo</h2>
                                                <p className="text-slate-400 text-sm sm:text-base">
                                                    Elige {teamSize} jugador{teamSize > 1 ? "es" : ""} para la misión
                                                </p>
                                            </div>
                                            <TeamSelector
                                                players={roomState.players}
                                                selectedTeam={selectedTeam}
                                                setSelectedTeam={setSelectedTeam}
                                                teamSize={teamSize}
                                            />
                                            <button
                                                onClick={handlePropose}
                                                className={`btn-primary w-full sm:w-auto text-base sm:text-lg ${selectedTeam.length === teamSize ? "" : "opacity-50 cursor-not-allowed"
                                                    }`}
                                                disabled={selectedTeam.length !== teamSize}
                                            >
                                                Proponer Equipo ({selectedTeam.length}/{teamSize})
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 animate-pulse">⏳</div>
                                            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Esperando al Líder</h2>
                                            <p className="text-slate-400 text-sm sm:text-base">
                                                {roomState.players[roomState.leaderIndex].name} está seleccionando el equipo...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fase: Votar equipo */}
                            {phase === "voteTeam" && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-4 sm:space-y-6 p-2 sm:p-4">
                                    <div className="text-center">
                                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🗳️</div>
                                        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Votación de Equipo</h2>
                                        <p className="text-slate-400 text-sm sm:text-base mb-3 sm:mb-4">¿Apruebas este equipo?</p>
                                    </div>

                                    <div className="card bg-slate-700/30 max-w-md w-full">
                                        <h3 className="font-semibold mb-2 sm:mb-3 text-center text-sm sm:text-base">Equipo Propuesto</h3>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {roomState.proposedTeam.map((pid) => {
                                                const player = roomState.players.find((p) => p.id === pid);
                                                return (
                                                    <div
                                                        key={pid}
                                                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-sm sm:text-base"
                                                    >
                                                        {player?.name || pid}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="w-full max-w-md">
                                        <VoteButtons onVote={handleVote} />
                                    </div>
                                    <p className="text-slate-500 text-xs sm:text-sm">Todos deben votar</p>
                                </div>
                            )}

                            {/* Fase: Misión */}
                            {phase === "mission" && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-4 sm:space-y-6 p-2 sm:p-4">
                                    {isInTeam ? (
                                        <>
                                            {console.log("🎮 Fase misión - Role:", role, "canFail:", role === "spy")}
                                            <div className="text-center">
                                                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎯</div>
                                                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Misión en Curso</h2>
                                                <p className="text-slate-400 text-sm sm:text-base">Elige el resultado de tu acción</p>
                                            </div>
                                            <MissionAction
                                                canFail={role === "spy"}
                                                onAction={handleMission}
                                            />
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 animate-pulse">⏳</div>
                                            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Misión en Progreso</h2>
                                            <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6">
                                                El equipo está completando la misión...
                                            </p>
                                            <div className="card bg-slate-700/30 max-w-md mx-auto">
                                                <h3 className="font-semibold mb-2 text-sm sm:text-base">Equipo en Misión</h3>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {roomState.proposedTeam.map((pid) => {
                                                        const player = roomState.players.find((p) => p.id === pid);
                                                        return (
                                                            <div key={pid} className="px-2 py-1 sm:px-3 bg-slate-600 rounded-lg text-xs sm:text-sm">
                                                                {player?.name || pid}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
