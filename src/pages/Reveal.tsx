import React from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import MissionTracker from "../components/MissionTracker";

const Reveal: React.FC = () => {
    const navigate = useNavigate();
    const { roomState, spies, playerId } = useSocket();

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
                            <span className="text-5xl animate-pulse">🏆</span>
                        </div>
                    </div>
                    <div className="text-xl font-semibold text-slate-300">Cargando resultados...</div>
                    <div className="mt-4 flex gap-2 justify-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce animation-delay-2000"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce animation-delay-4000"></div>
                    </div>
                </div>
            </div>
        );
    }

    const passedMissions = roomState.results.filter((r) => r.passed).length;
    const failedMissions = roomState.results.filter((r) => !r.passed).length;

    let winner = "";
    let winnerIcon = "";
    let winnerGradient = "";
    let winnerBg = "";

    if (roomState.rejectedTeamsInRow >= 5 || failedMissions >= 3) {
        winner = "Los Espías";
        winnerIcon = "🕵️";
        winnerGradient = "from-red-500 via-red-600 to-rose-600";
        winnerBg = "bg-red-500/20";
    } else if (passedMissions >= 3) {
        winner = "La Resistencia";
        winnerIcon = "🛡️";
        winnerGradient = "from-blue-500 via-blue-600 to-cyan-600";
        winnerBg = "bg-blue-500/20";
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

            <div className="relative z-10 max-w-4xl mx-auto space-y-5 sm:space-y-6 md:space-y-8 animate-fadeIn">
                {/* Header de resultados espectacular */}
                <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 text-center hover:shadow-yellow-500/10 hover:shadow-3xl transition-all duration-300">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                    {/* Icono decorativo superior */}
                    <div className="inline-block mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-3xl blur-2xl opacity-50 animate-pulse-glow"></div>
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-yellow-500 via-orange-600 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                <span className="text-5xl sm:text-6xl">🏆</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8">
                        <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                            ¡Juego Terminado!
                        </span>
                    </h1>

                    {/* Badge del ganador */}
                    <div className="relative inline-block mb-6">
                        <div className={`absolute inset-0 rounded-2xl blur-xl opacity-60 ${winnerBg} animate-pulse-glow`}></div>
                        <div className={`relative flex flex-col sm:flex-row items-center gap-4 sm:gap-5 px-8 py-5 sm:px-10 sm:py-6 rounded-2xl bg-linear-to-r ${winnerGradient} shadow-2xl`}>
                            <div className="text-5xl sm:text-6xl drop-shadow-lg">
                                {winnerIcon}
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="text-sm text-white/90 uppercase tracking-[0.2em] font-bold mb-1">
                                    🎊 Ganador 🎊
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">
                                    {winner}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6">
                        <div className="px-5 py-3 bg-green-500/20 border border-green-500/40 rounded-xl">
                            <div className="text-xs text-green-300 uppercase tracking-wider font-semibold mb-1">Éxitos</div>
                            <div className="text-2xl sm:text-3xl font-black text-green-400">{passedMissions}</div>
                        </div>
                        <div className="text-2xl text-slate-600">•</div>
                        <div className="px-5 py-3 bg-red-500/20 border border-red-500/40 rounded-xl">
                            <div className="text-xs text-red-300 uppercase tracking-wider font-semibold mb-1">Fallos</div>
                            <div className="text-2xl sm:text-3xl font-black text-red-400">{failedMissions}</div>
                        </div>
                    </div>
                </div>

                {/* Tracker de misiones mejorado */}
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 hover:shadow-purple-500/10 hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="text-2xl">📊</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Resumen de Misiones</h2>
                    </div>

                    <div className="overflow-x-auto flex justify-center mb-6 sm:mb-8 pb-2">
                        <MissionTracker total={5} results={roomState.results} />
                    </div>

                    <div className="space-y-3">
                        {roomState.results.map((r, idx) => (
                            <div
                                key={idx}
                                className={`relative backdrop-blur-sm rounded-xl p-4 sm:p-5 border transition-all duration-300 hover:scale-[1.02] ${r.passed
                                    ? "bg-green-500/10 border-green-500/40 hover:shadow-lg hover:shadow-green-500/20"
                                    : "bg-red-500/10 border-red-500/40 hover:shadow-lg hover:shadow-red-500/20"
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${r.passed
                                            ? "bg-green-500/20 border border-green-500/40"
                                            : "bg-red-500/20 border border-red-500/40"
                                            }`}>
                                            {r.passed ? "✅" : "❌"}
                                        </div>
                                        <div>
                                            <div className="font-bold text-base sm:text-lg text-white">Misión {idx + 1}</div>
                                            <div className={`text-sm font-bold ${r.passed ? "text-green-400" : "text-red-400"}`}>
                                                {r.passed ? "✓ ÉXITO" : "✗ FRACASO"}
                                            </div>
                                        </div>
                                    </div>
                                    {r.fails > 0 && (
                                        <div className="px-4 py-2 bg-red-600/80 border border-red-500/50 rounded-lg shadow-lg">
                                            <span className="text-white font-bold text-sm">
                                                {r.fails} fallo{r.fails > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40">
                                    <div className="text-xs text-slate-400 font-semibold mb-1">Equipo</div>
                                    <div className="text-sm text-white font-medium">
                                        {r.team
                                            .map((pid) => roomState.players.find((p) => p.id === pid)?.name || pid)
                                            .join(", ")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roles revelados mejorado */}
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 hover:shadow-pink-500/10 hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="text-2xl">🎭</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white">Roles Revelados</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {roomState.players.map((p) => {
                            const isSpy = spies.includes(p.id);
                            const isCurrentPlayer = p.id === playerId;
                            return (
                                <div
                                    key={p.id}
                                    className={`
                                        relative backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02]
                                        ${isSpy
                                            ? "bg-red-600/10 border border-red-500/40 hover:shadow-lg hover:shadow-red-500/20"
                                            : "bg-blue-600/10 border border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/20"
                                        }
                                        ${isCurrentPlayer ? "ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/20" : ""}
                                    `}
                                >
                                    {/* Efecto de brillo en hover */}
                                    <div className={`absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 ${isSpy ? "bg-linear-to-tr from-red-500/0 via-red-500/10 to-red-500/0" : "bg-linear-to-tr from-blue-500/0 via-blue-500/10 to-blue-500/0"
                                        }`}></div>

                                    <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-lg ${isSpy
                                        ? "bg-linear-to-br from-red-600 to-red-700"
                                        : "bg-linear-to-br from-blue-600 to-blue-700"
                                        }`}>
                                        {isSpy ? "🕵️" : "🛡️"}
                                    </div>
                                    <div className="relative flex-1 min-w-0">
                                        <div className="font-bold flex items-center gap-2 text-base text-white">
                                            <span className="truncate">{p.name}</span>
                                            {isCurrentPlayer && (
                                                <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded text-yellow-400 text-xs shrink-0">
                                                    Tú
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-sm font-semibold ${isSpy ? "text-red-400" : "text-blue-400"}`}>
                                            {isSpy ? "🕵️ Espía" : "🛡️ Resistencia"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Botón para volver mejorado */}
                <div className="text-center pb-6">
                    <button
                        onClick={() => navigate("/")}
                        className="relative group overflow-hidden w-full sm:w-auto"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-blue-400/0 via-white/20 to-pink-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <div className="relative px-8 py-4 flex items-center justify-center gap-3 text-white font-bold text-lg sm:text-xl">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🏠</span>
                            <span>Volver al Inicio</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reveal;
