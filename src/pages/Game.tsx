import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useGame } from "../hooks/useGame";
import { useSocket } from "../context/SocketContext";
import TeamSelector from "../components/TeamSelector";
import VoteButtons from "../components/VoteButtons";
import MissionAction from "../components/MissionAction";
import MissionTracker from "../components/MissionTracker";
import GameStatus from "../components/GameStatus";
import RulesButton from "../components/RulesButton";
import { Gamepad2, Loader2, Target, Users, Clock, Swords, Vote } from "lucide-react";

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
            console.log("⚠ Solicitando rol porque no lo tenemos");
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
            <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
                {/* Fondo animado */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                </div>

                {/* Loading */}
                <div className="relative z-10 text-center animate-fadeIn">
                    <div className="inline-block mb-6 relative">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 animate-pulse-glow"></div>
                        <div className="relative w-20 h-20 bg-linear-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Gamepad2 className="w-10 h-10 text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="text-xl font-semibold text-slate-300">Cargando juego...</div>
                    <div className="mt-4 flex gap-2 justify-center">
                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
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
        <div className="relative min-h-screen p-3 sm:p-6 overflow-hidden">
            {/* Fondo animado mejorado */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>
            </div>

            {/* Partículas decorativas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
                <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-float animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-4 sm:space-y-6 animate-fadeIn">
                {/* Header con código de sala mejorado */}
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl px-5 py-4 shadow-xl border border-white/10 flex items-center justify-between">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-50"></div>
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
                                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-medium mb-0.5">Sala</div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">
                                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    {roomState.code}
                                </span>
                            </h1>
                        </div>
                    </div>

                    <RulesButton />
                </div>

                {/* Tracker de misiones mejorado */}
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-5 sm:p-6 shadow-xl border border-white/10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                        <h2 className="text-lg sm:text-xl font-bold text-white">Progreso de Misiones</h2>
                    </div>
                    <div className="overflow-x-auto flex justify-center pb-2">
                        <MissionTracker total={5} results={roomState.results} />
                    </div>
                </div>

                {/* Layout responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6">
                    {/* Columna izquierda: Estado e información */}
                    <div className="lg:col-span-1 space-y-2 sm:space-y-4 order-2 lg:order-1">
                        {/* Estado del juego y rol */}
                        <div className="relative backdrop-blur-xl bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl border border-white/10 hover:shadow-blue-500/10 hover:shadow-2xl transition-all duration-300">
                            <GameStatus
                                leader={roomState.players[roomState.leaderIndex].name}
                                phase={phase}
                                rejectedTeams={roomState.rejectedTeamsInRow}
                                role={role}
                                otherSpies={otherSpiesNames}
                            />
                        </div>

                        {/* Resultado de la última misión mejorado */}
                        {roomState.results.length > 0 && (
                            <div className={`relative backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border transition-all duration-300 ${roomState.results[roomState.results.length - 1].passed
                                ? "bg-green-500/10 border-green-500/40 hover:shadow-green-500/20 hover:shadow-2xl"
                                : "bg-red-500/10 border-red-500/40 hover:shadow-red-500/20 hover:shadow-2xl"
                                }`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Última Misión</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-lg ${roomState.results[roomState.results.length - 1].passed
                                        ? "bg-green-500/20 border border-green-500/40 text-green-400"
                                        : "bg-red-500/20 border border-red-500/40 text-red-400"
                                        }`}>
                                        <span className="text-2xl">
                                            {roomState.results[roomState.results.length - 1].passed ? "✅" : "❌"}
                                        </span>
                                        <span>{roomState.results[roomState.results.length - 1].passed ? "ÉXITO" : "FRACASO"}</span>
                                    </div>

                                    <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
                                        <div className="text-xs text-slate-400 mb-1 font-semibold">Equipo</div>
                                        <div className="text-sm text-white font-medium">
                                            {roomState.results[roomState.results.length - 1].team
                                                .map((pid) => roomState.players.find((p) => p.id === pid)?.name || pid)
                                                .join(", ")}
                                        </div>
                                    </div>

                                    {roomState.results[roomState.results.length - 1].fails > 0 && (
                                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                                            <div className="text-xs text-red-300 mb-1 font-semibold">Votos de Fallo</div>
                                            <div className="text-lg text-red-400 font-bold">
                                                {roomState.results[roomState.results.length - 1].fails}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha: Área de juego principal mejorada */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/10 min-h-[350px] sm:min-h-[450px] flex flex-col hover:shadow-purple-500/10 hover:shadow-3xl transition-all duration-300">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                            {/* Fase: Proponer equipo */}
                            {phase === "proposeTeam" && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-5 sm:space-y-6 p-2 sm:p-4">
                                    {isLeader ? (
                                        <>
                                            <div className="text-center">
                                                <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white flex items-center justify-center gap-2 sm:gap-3">
                                                    <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                                    <span>Selecciona tu Equipo</span>
                                                </h2>
                                                <p className="text-slate-300 text-base sm:text-lg">
                                                    Elige <span className="font-bold text-blue-400">{teamSize}</span> jugador{teamSize > 1 ? "es" : ""} para la misión
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
                                                className="relative group overflow-hidden w-full sm:w-auto"
                                                disabled={selectedTeam.length !== teamSize}
                                            >
                                                <div className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${selectedTeam.length === teamSize
                                                    ? "bg-linear-to-r from-blue-600 via-blue-500 to-purple-600 opacity-90 group-hover:opacity-100"
                                                    : "bg-slate-700 opacity-50"
                                                    }`}></div>
                                                {selectedTeam.length === teamSize && (
                                                    <div className="absolute inset-0 bg-linear-to-r from-blue-400/0 via-white/20 to-blue-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                                )}
                                                <div className="relative px-6 py-3.5 flex items-center justify-center gap-2 text-white font-bold text-lg">
                                                    <span>Proponer Equipo</span>
                                                    <span className="px-2 py-0.5 bg-white/20 rounded-md text-sm">
                                                        {selectedTeam.length}/{teamSize}
                                                    </span>
                                                </div>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <Clock className="w-14 h-14 mb-4 animate-pulse text-blue-400 mx-auto" />
                                            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">Esperando al Líder</h2>
                                            <p className="text-slate-300 text-base sm:text-lg">
                                                <span className="font-semibold text-blue-400">{roomState.players[roomState.leaderIndex].name}</span> está seleccionando el equipo...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fase: Votar equipo mejorada */}
                            {phase === "voteTeam" && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-5 sm:space-y-6 p-2 sm:p-4">
                                    <div className="text-center">
                                        <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white flex items-center justify-center gap-2 sm:gap-3">
                                            <Vote className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                            <span>Votación de Equipo</span>
                                        </h2>
                                        <p className="text-slate-300 text-base sm:text-lg mb-4">¿Apruebas este equipo?</p>
                                    </div>

                                    <div className="w-full max-w-md p-5 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                                        <div className="flex items-center gap-2 justify-center mb-3">
                                            <Users className="w-5 h-5 text-blue-400" />
                                            <h3 className="font-bold text-white text-base">Equipo Propuesto</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {roomState.proposedTeam.map((pid) => {
                                                const player = roomState.players.find((p) => p.id === pid);
                                                return (
                                                    <div
                                                        key={pid}
                                                        className="relative group overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                                        <div className="relative px-4 py-2 font-semibold text-white text-sm sm:text-base">
                                                            {player?.name || pid}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="w-full max-w-md">
                                        <VoteButtons onVote={handleVote} />
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-700/30">
                                        <span className="text-slate-400 text-xs sm:text-sm">💡 Todos deben votar</span>
                                    </div>
                                </div>
                            )}

                            {/* Fase: Misión mejorada */}
                            {phase === "mission" && (
                                <div className="flex-1 flex flex-col items-center justify-center space-y-5 sm:space-y-6 p-2 sm:p-4">
                                    {isInTeam ? (
                                        <>
                                            <div className="text-center">
                                                <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white flex items-center justify-center gap-2 sm:gap-3">
                                                    <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                                    <span>Misión en Curso</span>
                                                </h2>
                                                <p className="text-slate-300 text-base sm:text-lg">Elige el resultado de tu acción</p>
                                            </div>
                                            <MissionAction
                                                canFail={role === "spy"}
                                                onAction={handleMission}
                                            />
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <Clock className="w-14 h-14 mb-4 animate-pulse text-green-400 mx-auto" />
                                            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">Misión en Progreso</h2>
                                            <p className="text-slate-300 text-base sm:text-lg mb-6">
                                                El equipo está completando la misión...
                                            </p>
                                            <div className="max-w-md mx-auto p-5 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                                                <div className="flex items-center gap-2 justify-center mb-3">
                                                    <Swords className="w-5 h-5 text-green-400" />
                                                    <h3 className="font-bold text-white text-base">Equipo en Misión</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {roomState.proposedTeam.map((pid) => {
                                                        const player = roomState.players.find((p) => p.id === pid);
                                                        return (
                                                            <div key={pid} className="px-3 py-1.5 bg-slate-700/70 border border-slate-600/50 rounded-lg text-sm font-medium text-white">
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
