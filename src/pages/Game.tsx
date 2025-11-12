import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useGame } from "../hooks/useGame";
import { useSocket } from "../context/SocketContext";
import TeamSelector from "../components/TeamSelector";
import VoteButtons from "../components/VoteButtons";
import MissionAction from "../components/MissionAction";
import MissionTracker from "../components/MissionTracker";
import GameStatus from "../components/GameStatus";
import RulesButton from "../components/RulesButton";
import MissionSuspense from "../components/MissionSuspense";
import VotingStatus from "../components/VotingStatus";
import MissionStatus from "../components/MissionStatus";
import MissionDetailModal from "../components/MissionDetailModal";
import type { MissionResult } from "../types";
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

    // Estado para el componente de suspenso
    const [showSuspense, setShowSuspense] = useState(false);
    const [suspenseResult, setSuspenseResult] = useState<{
        missionNumber: number;
        result: { passed: boolean; fails: number; team: string[] };
    } | null>(null);
    const previousResultsLength = useRef(0);
    const isInitialLoad = useRef(true);

    // Estado para el modal de detalles de misión
    const [selectedMission, setSelectedMission] = useState<{
        index: number;
        result: MissionResult;
    } | null>(null);

    // Solicitar rol si el juego ya comenzó pero no tenemos rol
    useEffect(() => {
        if (roomCode && roomState && phase !== "lobby" && !role) {
            console.log("⚠ Solicitando rol porque no lo tenemos");
            requestRole(roomCode);
        }
    }, [roomCode, roomState, phase, role, requestRole]);

    // Detectar cuando se completa una misión y mostrar suspenso
    useEffect(() => {
        if (!roomState || !roomState.results) return;

        const currentResultsLength = roomState.results.length;

        // En la primera carga, solo inicializar el contador
        if (isInitialLoad.current) {
            previousResultsLength.current = currentResultsLength;
            isInitialLoad.current = false;
            return;
        }

        // Si hay un nuevo resultado (una misión se completó)
        if (currentResultsLength > previousResultsLength.current && currentResultsLength > 0) {
            const latestResult = roomState.results[currentResultsLength - 1];
            setSuspenseResult({
                missionNumber: currentResultsLength,
                result: latestResult,
            });
            setShowSuspense(true);
            // NO actualizar previousResultsLength aquí - se actualizará cuando termine la animación
        } else if (currentResultsLength === previousResultsLength.current) {
            // Solo actualizar si no hay resultado nuevo pendiente
            previousResultsLength.current = currentResultsLength;
        }
    }, [roomState]);

    // Si el juego terminó, redirigir a la pantalla Reveal (solo después del suspense)
    useEffect(() => {
        if (phase === "reveal" && roomCode) {
            // Si hay un nuevo resultado pendiente de mostrar, esperar
            const currentResultsLength = roomState?.results?.length || 0;
            const hasNewResult = currentResultsLength > previousResultsLength.current;

            // Solo navegar si no hay suspense activo ni resultado nuevo pendiente
            if (!showSuspense && !hasNewResult) {
                navigate(`/reveal/${roomCode}`);
            }
        }
    }, [phase, roomCode, navigate, showSuspense, roomState]);

    // Calcular resultados a mostrar en el tracker (ocultar el último si hay suspense o resultado nuevo)
    const visibleResults = useMemo(() => {
        if (!roomState?.results) return [];

        const currentLength = roomState.results.length;
        const hasNewResult = currentLength > previousResultsLength.current;

        // Si hay suspense activo o un resultado nuevo pendiente, ocultar el último
        if (showSuspense || hasNewResult) {
            return roomState.results.slice(0, previousResultsLength.current);
        }

        return roomState.results;
    }, [roomState?.results, showSuspense]);

    // Lista de nombres de otros espías (si eres espía)
    const otherSpiesNames = useMemo(() => {
        if (!roomState || role !== "spy" || !spies || spies.length === 0) return [];
        return spies
            .filter((id) => id !== playerId)
            .map((id) => roomState.players.find((p) => p.id === id)?.name || id);
    }, [role, spies, playerId, roomState]);

    if (!roomState) {
        return (
            <div className="relative flex items-center justify-center min-h-screen overflow-hidden p-4">
                {/* Fondo animado */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                </div>

                {/* Loading con diseño táctico */}
                <div className="relative z-10 w-full max-w-md animate-fadeIn">
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"></div>

                        <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                            {/* Icono de carga */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur-xl animate-pulse"></div>
                                    <div className="relative w-16 h-16 rounded-lg flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                </div>
                            </div>

                            {/* Título con estilo dossier */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="h-px flex-1 max-w-16 bg-linear-to-r from-transparent to-slate-500/50"></div>
                                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                                    Cargando
                                </h2>
                                <div className="h-px flex-1 max-w-16 bg-linear-to-l from-transparent to-slate-500/50"></div>
                            </div>

                            <p className="text-center text-slate-400 text-sm font-medium mb-6">
                                Preparando la partida...
                            </p>

                            {/* Botón para volver a Home */}
                            <button
                                onClick={() => navigate("/")}
                                className="w-full px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-white rounded-lg font-semibold text-sm transition-colors"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
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

    const handleSuspenseComplete = () => {
        setShowSuspense(false);
        setSuspenseResult(null);
        // Actualizar el contador ahora que la animación terminó
        if (roomState?.results) {
            previousResultsLength.current = roomState.results.length;
        }
    };

    const handleMissionClick = (missionIndex: number, result: MissionResult) => {
        setSelectedMission({ index: missionIndex, result });
    };

    const handleCloseMissionModal = () => {
        setSelectedMission(null);
    };

    return (
        <div className="relative min-h-screen p-3 sm:p-6 overflow-hidden">
            {/* Componente de suspenso de misión */}
            {showSuspense && suspenseResult && (
                <MissionSuspense
                    missionNumber={suspenseResult.missionNumber}
                    result={suspenseResult.result}
                    onComplete={handleSuspenseComplete}
                />
            )}

            {/* Modal de detalles de misión */}
            {selectedMission && roomState && (
                <MissionDetailModal
                    missionNumber={selectedMission.index + 1}
                    result={selectedMission.result}
                    players={roomState.players}
                    onClose={handleCloseMissionModal}
                />
            )}

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
                {/* Header con código de sala */}
                <div className="relative group">
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-purple-500/10 to-pink-500/0"></div>

                    <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-xl px-5 py-4 shadow-xl border border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-semibold mb-0.5 uppercase tracking-wide">Sala</div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">
                                    <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        {roomState.code}
                                    </span>
                                </h1>
                            </div>
                        </div>

                        <RulesButton />
                    </div>
                </div>

                {/* Tracker de misiones */}
                <div className="relative group">
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0"></div>

                    <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-xl p-4 sm:p-6 shadow-xl border border-slate-700/50">
                        {/* Header estilo dossier */}
                        <div className="flex items-center justify-center gap-2 mb-5">
                            <div className="h-px flex-1 bg-linear-to-r from-transparent to-purple-500/50"></div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded">
                                <Target className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-300 text-xs font-bold uppercase tracking-widest">Progreso de Misiones</span>
                            </div>
                            <div className="h-px flex-1 bg-linear-to-l from-transparent to-purple-500/50"></div>
                        </div>

                        <div className="overflow-x-auto flex justify-center py-2">
                            <MissionTracker
                                total={5}
                                results={visibleResults}
                                failsRequired={roomState.failsRequired}
                                onMissionClick={handleMissionClick}
                            />
                        </div>
                    </div>
                </div>

                {/* Layout responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6">
                    {/* Columna izquierda: Estado e información */}
                    <div className="lg:col-span-1 space-y-2 sm:space-y-4 order-2 lg:order-1">
                        {/* Estado del juego y rol */}
                        <GameStatus
                            leader={roomState.players[roomState.leaderIndex].name}
                            phase={phase}
                            rejectedTeams={roomState.rejectedTeamsInRow}
                            role={role}
                            otherSpies={otherSpiesNames}
                        />
                    </div>

                    {/* Columna derecha: Área de juego principal */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/50 min-h-[250px] sm:min-h-[450px] flex flex-col transition-all duration-300">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-slate-600/50 to-transparent"></div>

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
                                        <div className="space-y-4">
                                            <div className="relative group">
                                                <div className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"></div>

                                                <div className="relative backdrop-blur-sm rounded-lg p-6 border bg-blue-500/15 border-blue-500/40">
                                                    <div className="flex flex-col items-center text-center">
                                                        <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600 mb-4">
                                                            <Clock className="w-7 h-7 text-white animate-pulse" />
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-white mb-2">Esperando al Líder</h2>
                                                        <p className="text-slate-300 text-base">
                                                            <span className="font-semibold text-blue-300">{roomState.players[roomState.leaderIndex].name}</span> está seleccionando el equipo
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
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

                                    <div className="relative w-full max-w-lg">
                                        {/* Header estilo dossier */}
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <div className="h-px flex-1 bg-linear-to-r from-transparent to-blue-500/50"></div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded">
                                                <Target className="w-4 h-4 text-blue-400" />
                                                <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Equipo de Misión</span>
                                            </div>
                                            <div className="h-px flex-1 bg-linear-to-l from-transparent to-blue-500/50"></div>
                                        </div>

                                        {/* Grid de agentes */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {roomState.proposedTeam.map((pid, index) => {
                                                const player = roomState.players.find((p) => p.id === pid);
                                                const name = player?.name || pid;
                                                return (
                                                    <div
                                                        key={pid}
                                                        className="relative group"
                                                    >
                                                        {/* Efecto de brillo */}
                                                        <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/20 to-purple-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                        {/* Card del agente */}
                                                        <div className="relative backdrop-blur-sm bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 group-hover:border-blue-500/50 transition-all duration-300">
                                                            <div className="flex items-center gap-2">
                                                                {/* Número de agente */}
                                                                <div className="shrink-0 w-6 h-6 rounded bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                                    <span className="text-white text-xs font-black">{index + 1}</span>
                                                                </div>
                                                                {/* Nombre */}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-white font-semibold text-sm truncate">{name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="w-full max-w-md">
                                        <VoteButtons
                                            onVote={handleVote}
                                            players={roomState.players}
                                            votedPlayers={roomState.votedPlayers || []}
                                            currentPlayerId={playerId || ""}
                                        />
                                    </div>

                                    {/* Mostrar estado de votación solo si el jugador NO ha votado */}
                                    {roomState.votedPlayers && playerId && !roomState.votedPlayers.includes(playerId) && (
                                        <VotingStatus
                                            players={roomState.players}
                                            votedPlayers={roomState.votedPlayers}
                                            currentPlayerId={playerId}
                                        />
                                    )}

                                    <div className="relative group">
                                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"></div>
                                        <div className="relative backdrop-blur-sm rounded-lg px-4 py-2 border bg-slate-800/60 border-slate-700/50 flex items-center justify-center gap-2">
                                            <span className="text-slate-300 text-xs sm:text-sm font-medium">💡 Todos deben votar</span>
                                        </div>
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

                                            {/* Mostrar estado de misión si tenemos la información */}
                                            {roomState.playersActed && playerId && roomState.playersActed.includes(playerId) && (
                                                <MissionStatus
                                                    teamMembers={roomState.proposedTeam}
                                                    players={roomState.players}
                                                    playersActed={roomState.playersActed}
                                                    currentPlayerId={playerId}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="space-y-5">
                                            <div className="relative group">
                                                <div className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-green-500/0 via-green-500/10 to-green-500/0"></div>

                                                <div className="relative backdrop-blur-sm rounded-lg p-6 border bg-green-500/15 border-green-500/40">
                                                    <div className="flex flex-col items-center text-center">
                                                        <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-linear-to-br from-green-500 to-green-600 mb-4">
                                                            <Clock className="w-7 h-7 text-white animate-pulse" />
                                                        </div>
                                                        <h2 className="text-2xl font-bold text-white mb-2">Misión en Progreso</h2>
                                                        <p className="text-slate-300 text-base">
                                                            El equipo está completando la misión
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mostrar estado de misión */}
                                            {roomState.playersActed && playerId ? (
                                                <MissionStatus
                                                    teamMembers={roomState.proposedTeam}
                                                    players={roomState.players}
                                                    playersActed={roomState.playersActed}
                                                    currentPlayerId={playerId}
                                                />
                                            ) : (
                                                <div className="relative group">
                                                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"></div>

                                                    <div className="relative backdrop-blur-sm rounded-lg p-4 border bg-slate-800/60 border-slate-700/50">
                                                        <div className="flex items-center gap-2 justify-center mb-3">
                                                            <div className="w-7 h-7 rounded flex items-center justify-center bg-linear-to-br from-slate-600 to-slate-700">
                                                                <Swords className="w-4 h-4 text-white" />
                                                            </div>
                                                            <h3 className="font-bold text-white text-sm uppercase tracking-wide">Equipo en Misión</h3>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 justify-center">
                                                            {roomState.proposedTeam.map((pid) => {
                                                                const player = roomState.players.find((p) => p.id === pid);
                                                                return (
                                                                    <div key={pid} className="px-3 py-1.5 bg-slate-700/70 border border-slate-600/50 rounded text-sm font-medium text-white">
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
