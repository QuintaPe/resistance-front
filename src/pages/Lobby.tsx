import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import { Target, Gamepad2, Loader2, Clipboard, Check, Crown, Users, Rocket, Clock, Lightbulb } from "lucide-react";

const Lobby: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { roomState, playerId, startGame } = useSocket();
    const [copied, setCopied] = useState(false);

    // Navegar automáticamente cuando el juego comience
    useEffect(() => {
        if (roomState && roomState.phase !== "lobby" && roomCode) {
            navigate(`/game/${roomCode}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomState?.phase, roomCode, navigate]);

    const handleCopyCode = () => {
        if (roomState?.code) {
            navigator.clipboard.writeText(roomState.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
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
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 animate-pulse-glow"></div>
                        <div className="relative w-20 h-20 bg-linear-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Gamepad2 className="w-10 h-10 text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="text-xl font-semibold text-slate-300">Cargando sala...</div>
                    <div className="mt-4 flex gap-2 justify-center">
                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    const leader = roomState.players[roomState.leaderIndex];
    const canStart = roomState.players.length >= 5 && playerId === leader.id;

    const handleStart = () => {
        if (roomCode) startGame(roomCode);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 overflow-hidden">
            {/* Fondo animado mejorado */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute top-0 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl space-y-5 sm:space-y-6 px-4 sm:px-0 animate-fadeIn">
                {/* Header con código de sala mejorado */}
                <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 text-center hover:shadow-blue-500/10 hover:shadow-3xl transition-all duration-300">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                    {/* Icono decorativo */}
                    <div className="inline-block mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 animate-pulse-glow"></div>
                            <div className="relative w-14 h-14 bg-linear-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black mb-4">
                        <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                            Sala de Espera
                        </span>
                    </h1>

                    <div className="flex flex-col items-center gap-3 mb-3">
                        <span className="text-slate-400 text-sm font-medium">Código de sala</span>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-500/30 to-purple-500/30 rounded-xl blur"></div>
                            <div className="relative bg-slate-800/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                                <span className="text-2xl sm:text-3xl font-black tracking-[0.3em] text-white">
                                    {roomState.code}
                                </span>
                                <button
                                    onClick={handleCopyCode}
                                    className="ml-2 p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group/btn"
                                    title="Copiar código"
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Clipboard className="w-5 h-5 text-slate-400 group-hover/btn:text-white transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-400 text-sm">
                        {copied ? "¡Código copiado!" : "Comparte este código con tus amigos"}
                    </p>
                </div>



                {/* Lista de jugadores mejorada */}
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-5 sm:p-6 shadow-xl border border-white/10">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                            <Users className="w-6 h-6" />
                            <span>Jugadores</span>
                        </h3>
                        <div className="px-4 py-1.5 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full">
                            <span className="text-sm font-bold">
                                <span className={roomState.players.length >= 5 ? "text-green-400" : "text-yellow-400"}>
                                    {roomState.players.length}
                                </span>
                                <span className="text-slate-500">/10</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
                        {roomState.players.map((p, index) => (
                            <div
                                key={p.id}
                                className={`
                                    group relative p-3.5 rounded-xl flex items-center gap-3 transition-all duration-200
                                    ${p.id === leader.id
                                        ? "bg-linear-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 hover:border-yellow-500/60"
                                        : "bg-slate-800/40 border border-slate-700/40 hover:border-slate-600/60 hover:bg-slate-800/60"
                                    }
                                    
                                `}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 shadow-md ${p.id === leader.id
                                    ? "bg-linear-to-br from-yellow-500 to-orange-500 text-white"
                                    : "bg-linear-to-br from-blue-500 to-purple-500 text-white"
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate text-base text-white">
                                        {p.name}
                                        {p.id === playerId && <span className="text-blue-400 ml-1.5 text-sm">(Tú)</span>}
                                    </div>
                                </div>
                                {p.id === leader.id && (
                                    <Crown className="w-5 h-5 text-yellow-400 shrink-0 animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mensaje de estado / Botón de inicio mejorado */}
                {roomState.players.length < 5 ? (
                    <div className="relative backdrop-blur-xl bg-yellow-500/10 rounded-2xl p-6 shadow-xl border border-yellow-500/30 text-center">
                        <div className="absolute inset-0 bg-linear-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 animate-shimmer"></div>
                        <div className="relative">
                            <Clock className="w-12 h-12 sm:w-14 sm:h-14 mb-3 animate-bounce text-yellow-400 mx-auto" />
                            <p className="text-yellow-400 font-bold mb-2 text-base sm:text-lg">
                                Esperando más jugadores...
                            </p>
                            <p className="text-slate-300 text-sm sm:text-base">
                                Se necesitan al menos <span className="font-bold text-yellow-400">{5 - roomState.players.length}</span> jugador{5 - roomState.players.length > 1 ? 'es' : ''} más
                            </p>
                        </div>
                    </div>
                ) : canStart ? (
                    <button
                        onClick={handleStart}
                        className="relative w-full group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-green-600 via-green-500 to-emerald-600 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <div className="relative px-6 py-4 flex items-center justify-center gap-3 text-white font-bold text-xl sm:text-2xl">
                            <Rocket className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                            <span>Iniciar Juego</span>
                        </div>
                    </button>
                ) : (
                    <div className="relative backdrop-blur-xl bg-blue-500/10 rounded-2xl p-6 shadow-xl border border-blue-500/30 text-center">
                        <Clock className="w-12 h-12 sm:w-14 sm:h-14 mb-3 animate-pulse text-blue-400 mx-auto" />
                        <p className="text-blue-400 font-semibold text-base sm:text-lg">
                            Esperando al líder para iniciar el juego...
                        </p>
                    </div>
                )}

                {/* Instrucciones mejoradas */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-700/30">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-400 text-xs sm:text-sm">
                            Mínimo 5 jugadores para empezar
                        </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/30 backdrop-blur-sm rounded-full border border-slate-700/30">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-400 text-xs sm:text-sm">
                            El líder inicia la partida
                        </span>
                    </div>
                </div>
            </div>

            {/* Partículas decorativas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
                <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-float animation-delay-4000"></div>
            </div>
        </div>
    );
};

export default Lobby;
