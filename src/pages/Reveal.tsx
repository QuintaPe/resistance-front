import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSocket } from "../context/SocketContext";
import MissionTracker from "../components/MissionTracker";
import { Trophy, Loader2, BarChart3, Drama, Home, UserX, Shield, CheckCircle, XCircle, RotateCcw, Users } from "lucide-react";

const Reveal: React.FC = () => {
    const navigate = useNavigate();
    const { roomCode } = useParams<{ roomCode: string }>();
    const { roomState, spies, playerId, restartGame, returnToLobby, socket } = useSocket();
    const [isRestarting, setIsRestarting] = useState(false);
    const [restartError, setRestartError] = useState<string | null>(null);
    const [isReturningToLobby, setIsReturningToLobby] = useState(false);
    const [returnToLobbyError, setReturnToLobbyError] = useState<string | null>(null);
    
    // Detectar si soy el creador
    const isCreator = roomState?.creatorId === playerId;

    // Redirigir al lobby cuando se reinicia el juego
    useEffect(() => {
        if (roomCode && roomState) {
            if (roomState.phase === "lobby") {
                navigate(`/lobby/${roomCode}`);
            } else if (roomState.phase === "proposeTeam") {
                navigate(`/game/${roomCode}`);
            }
        }
    }, [roomState?.phase, roomCode, navigate]);

    // Escuchar cuando nos expulsan
    useEffect(() => {
        const handleKicked = () => {
            navigate("/");
        };

        socket.on("player:kicked", handleKicked);

        return () => {
            socket.off("player:kicked", handleKicked);
        };
    }, [socket, navigate]);

    const handleRestart = () => {
        if (!roomState?.code) return;

        setIsRestarting(true);
        setRestartError(null);

        restartGame(roomState.code, (ok, error) => {
            setIsRestarting(false);
            if (!ok && error) {
                setRestartError(error);
            }
            // Si todo va bien, el servidor enviará un room:update que actualizará el estado
        });
    };

    const handleReturnToLobby = () => {
        if (!roomState?.code) return;

        setIsReturningToLobby(true);
        setReturnToLobbyError(null);

        returnToLobby(roomState.code, (ok, error) => {
            setIsReturningToLobby(false);
            if (!ok && error) {
                setReturnToLobbyError(error);
            }
            // Si todo va bien, el servidor enviará un room:update que actualizará el estado
        });
    };

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
                        <div className="absolute inset-0 bg-linear-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-50 animate-pulse-glow"></div>
                        <div className="relative w-24 h-24 bg-linear-to-br from-yellow-500 via-orange-600 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Trophy className="w-14 h-14 text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="text-xl font-semibold text-slate-300">Cargando resultados...</div>
                    <div className="mt-4 flex gap-2 justify-center">
                        <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    const passedMissions = roomState.results.filter((r) => r.passed).length;
    const failedMissions = roomState.results.filter((r) => !r.passed).length;

    let winner = "";
    let WinnerIcon = null;

    if (roomState.rejectedTeamsInRow >= 5 || failedMissions >= 3) {
        winner = "Los Espías";
        WinnerIcon = UserX;
    } else if (passedMissions >= 3) {
        winner = "La Resistencia";
        WinnerIcon = Shield;
    }

    return (
        <div className="relative min-h-screen p-4 sm:p-6 overflow-hidden">
            {/* Fondo animado mejorado */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>
            </div>

            {/* Partículas decorativas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full animate-float"></div>
                <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-orange-400/30 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-yellow-400/30 rounded-full animate-float animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-12 sm:space-y-16 animate-fadeIn pt-8 sm:pt-12">
                {/* Header de resultados */}
                <div className="text-center space-y-8">
                    {/* Título */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px flex-1 max-w-32 bg-linear-to-r from-transparent to-slate-500/50"></div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                            ¡Juego Terminado!
                        </h1>
                        <div className="h-px flex-1 max-w-32 bg-linear-to-l from-transparent to-slate-500/50"></div>
                    </div>

                    {/* Badge del ganador */}
                    <div className="relative group/winner w-full max-w-md mx-auto">
                        <div className={`absolute inset-0 rounded-lg opacity-0 group-hover/winner:opacity-100 transition-opacity duration-300 ${winner === "Los Espías"
                            ? "bg-linear-to-r from-red-500/0 via-red-500/20 to-red-500/0"
                            : "bg-linear-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0"
                            }`}></div>

                        <div className={`relative backdrop-blur-sm rounded-lg p-4 border-2 transition-all duration-300 ${winner === "Los Espías"
                            ? "bg-red-500/15 border-red-500/50"
                            : "bg-blue-500/15 border-blue-500/50"
                            }`}>
                            <div className="flex items-center justify-center gap-3">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shrink-0 ${winner === "Los Espías"
                                    ? "bg-linear-to-br from-red-500 to-red-600"
                                    : "bg-linear-to-br from-blue-500 to-blue-600"
                                    }`}>
                                    {WinnerIcon && (
                                        <WinnerIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold">
                                            Ganador
                                        </span>
                                    </div>
                                    <div className={`text-xl sm:text-2xl font-black text-center ${winner === "Los Espías" ? "text-red-300" : "text-blue-300"
                                        }`}>
                                        {winner}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="relative group/stat">
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 bg-linear-to-r from-green-500/0 via-green-500/10 to-green-500/0"></div>
                            <div className="relative px-4 py-3 bg-green-500/15 border border-green-500/40 rounded-lg backdrop-blur-sm">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Éxitos</div>
                                <div className="text-2xl sm:text-3xl font-black text-green-300">{passedMissions}</div>
                            </div>
                        </div>
                        <div className="text-xl text-slate-600">•</div>
                        <div className="relative group/stat">
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"></div>
                            <div className="relative px-4 py-3 bg-red-500/15 border border-red-500/40 rounded-lg backdrop-blur-sm">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-1">Fallos</div>
                                <div className="text-2xl sm:text-3xl font-black text-red-300">{failedMissions}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracker de misiones */}
                <div>
                    <div className="flex items-center justify-center gap-2 mb-5">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-purple-500/50"></div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded">
                            <BarChart3 className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 text-xs font-bold uppercase tracking-widest">Resumen de Misiones</span>
                        </div>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-purple-500/50"></div>
                    </div>

                    <div className="overflow-x-auto flex justify-center mb-5 py-2">
                        <MissionTracker
                            total={5}
                            results={roomState.results}
                            failsRequired={roomState.failsRequired}
                        />
                    </div>

                    <div className="space-y-3">
                        {roomState.results.map((r, idx) => (
                            <div
                                key={idx}
                                className="relative group/mission"
                            >
                                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover/mission:opacity-100 transition-opacity duration-300 ${r.passed
                                    ? "bg-linear-to-r from-green-500/0 via-green-500/10 to-green-500/0"
                                    : "bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"
                                    }`}></div>

                                <div className={`relative backdrop-blur-sm rounded-lg p-3 sm:p-4 border transition-all duration-300 ${r.passed
                                    ? "bg-green-500/15 border-green-500/40"
                                    : "bg-red-500/15 border-red-500/40"
                                    }`}>
                                    <div className="flex sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className={`w-10 h-10 rounded flex items-center justify-center ${r.passed
                                                ? "bg-linear-to-br from-green-500 to-green-600"
                                                : "bg-linear-to-br from-red-500 to-red-600"
                                                }`}>
                                                {r.passed ? (
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Misión {idx + 1}</div>
                                                <div className={`text-sm font-bold ${r.passed ? "text-green-300" : "text-red-300"}`}>
                                                    {r.passed ? "✓ Éxito" : "✗ Fracaso"}
                                                </div>
                                            </div>
                                        </div>
                                        {r.fails > 0 && (
                                            <div className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded backdrop-blur-sm">
                                                <span className="text-red-300 font-bold text-xs">
                                                    {r.fails} {r.fails > 1 ? "fallos" : "fallo"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 bg-slate-800/60 rounded border border-slate-700/50">
                                        <div className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">Equipo</div>
                                        <div className="text-xs text-white font-medium">
                                            {r.team
                                                .map((pid) => roomState.players.find((p) => p.id === pid)?.name || pid)
                                                .join(", ")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roles revelados */}
                <div>
                    <div className="flex items-center justify-center gap-2 mb-5">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-pink-500/50"></div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded">
                            <Drama className="w-4 h-4 text-pink-400" />
                            <span className="text-pink-300 text-xs font-bold uppercase tracking-widest">Roles Revelados</span>
                        </div>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-pink-500/50"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {roomState.players.map((p) => {
                            const isSpy = spies.includes(p.id);
                            const isCurrentPlayer = p.id === playerId;
                            return (
                                <div
                                    key={p.id}
                                    className="relative group/player"
                                >
                                    <div className={`absolute inset-0 rounded-lg opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 ${isSpy
                                        ? "bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"
                                        : "bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"
                                        }`}></div>

                                    <div className={`relative backdrop-blur-sm rounded-lg p-3 flex items-center gap-2.5 border transition-all duration-300 ${isSpy
                                        ? "bg-red-500/15 border-red-500/40"
                                        : "bg-blue-500/15 border-blue-500/40"
                                        } ${isCurrentPlayer ? "ring-2 ring-yellow-500/60" : ""
                                        }`}>
                                        <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${isSpy
                                            ? "bg-linear-to-br from-red-500 to-red-600"
                                            : "bg-linear-to-br from-blue-500 to-blue-600"
                                            }`}>
                                            {isSpy ? (
                                                <UserX className="w-5 h-5 text-white" />
                                            ) : (
                                                <Shield className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-sm text-white truncate">{p.name}</span>
                                                {isCurrentPlayer && (
                                                    <span className="px-1.5 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded text-yellow-300 text-[10px] font-bold shrink-0">
                                                        TÚ
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-xs font-semibold ${isSpy ? "text-red-300" : "text-blue-300"}`}>
                                                {isSpy ? "Espía" : "Resistencia"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3 pb-6">
                    {/* Mensaje de error si hay */}
                    {restartError && (
                        <div className="relative group">
                            <div className="absolute inset-0 rounded-lg opacity-50 bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"></div>
                            <div className="relative backdrop-blur-xl bg-red-500/15 border border-red-500/40 rounded-lg p-3 text-center animate-fadeIn">
                                <p className="text-red-300 font-semibold text-sm">{restartError}</p>
                            </div>
                        </div>
                    )}

                    {returnToLobbyError && (
                        <div className="relative group">
                            <div className="absolute inset-0 rounded-lg opacity-50 bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"></div>
                            <div className="relative backdrop-blur-xl bg-red-500/15 border border-red-500/40 rounded-lg p-3 text-center animate-fadeIn">
                                <p className="text-red-300 font-semibold text-sm">{returnToLobbyError}</p>
                            </div>
                        </div>
                    )}

                    {/* Botón de reiniciar */}
                    <div className="text-center">
                        <button
                            onClick={handleRestart}
                            disabled={isRestarting}
                            className="relative group overflow-hidden w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-green-400/0 via-white/20 to-teal-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <div className="relative px-6 py-3 flex items-center justify-center gap-2.5 text-white font-bold text-base sm:text-lg">
                                {isRestarting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Reiniciando...</span>
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                        <span>Reiniciar Partida</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Botón de volver al lobby */}
                    <div className="text-center">
                        <button
                            onClick={handleReturnToLobby}
                            disabled={isReturningToLobby}
                            className="relative group overflow-hidden w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-yellow-600 via-orange-600 to-amber-600 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-yellow-400/0 via-white/20 to-amber-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <div className="relative px-6 py-3 flex items-center justify-center gap-2.5 text-white font-bold text-base sm:text-lg">
                                {isReturningToLobby ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Volviendo...</span>
                                    </>
                                ) : (
                                    <>
                                        <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                        <span>Volver al Lobby</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Botón para volver al inicio */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="relative group overflow-hidden w-full sm:w-auto"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-blue-400/0 via-white/20 to-pink-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            <div className="relative px-6 py-3 flex items-center justify-center gap-2.5 text-white font-bold text-base sm:text-lg">
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                <span>Volver al Inicio</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reveal;
