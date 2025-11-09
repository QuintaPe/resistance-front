import React from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import MissionTracker from "../components/MissionTracker";

const Reveal: React.FC = () => {
    const navigate = useNavigate();
    const { roomState, spies, playerId } = useSocket();

    if (!roomState) {
        return (
            <div className="loading-screen">
                <div className="animate-pulse">
                    <div className="text-4xl mb-4">🏆</div>
                    <div>Cargando resultados...</div>
                </div>
            </div>
        );
    }

    const passedMissions = roomState.results.filter((r) => r.passed).length;
    const failedMissions = roomState.results.filter((r) => !r.passed).length;

    let winner = "";
    let winnerIcon = "";
    let winnerColor = "";

    if (roomState.rejectedTeamsInRow >= 5 || failedMissions >= 3) {
        winner = "Los Espías";
        winnerIcon = "🕵️";
        winnerColor = "from-red-500 to-red-700";
    } else if (passedMissions >= 3) {
        winner = "La Resistencia";
        winnerIcon = "🛡️";
        winnerColor = "from-blue-500 to-blue-700";
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 animate-fadeIn">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-red-500/5"></div>
                <div className="absolute top-10 left-10 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
                {/* Header de resultados */}
                <div className="card-glow text-center py-6 sm:py-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ¡Juego Terminado!
                    </h1>

                    <div className={`inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r ${winnerColor} mb-4`}>
                        <span className="text-4xl sm:text-5xl">{winnerIcon}</span>
                        <div className="text-center sm:text-left">
                            <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wider">Ganador</div>
                            <div className="text-2xl sm:text-3xl font-black text-white">{winner}</div>
                        </div>
                    </div>

                    <p className="text-slate-400 mt-4 text-sm sm:text-base">
                        Éxitos: {passedMissions} | Fallos: {failedMissions}
                    </p>
                </div>

                {/* Tracker de misiones */}
                <div className="card-glow">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Resumen de Misiones</h2>
                    <div className="overflow-x-auto flex justify-center mb-4 sm:mb-6 pb-2">
                        <MissionTracker total={5} results={roomState.results} />
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        {roomState.results.map((r, idx) => (
                            <div
                                key={idx}
                                className={`p-3 sm:p-4 rounded-xl border ${r.passed
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-red-500/10 border-red-500/30"
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="text-xl sm:text-2xl">{r.passed ? "✅" : "❌"}</span>
                                        <div>
                                            <div className="font-bold text-sm sm:text-base">Misión {idx + 1}</div>
                                            <div className={`text-xs sm:text-sm ${r.passed ? "text-green-400" : "text-red-400"}`}>
                                                {r.passed ? "ÉXITO" : "FRACASO"}
                                            </div>
                                        </div>
                                    </div>
                                    {r.fails > 0 && (
                                        <span className="badge bg-red-600">
                                            {r.fails} fallo{r.fails > 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs sm:text-sm text-slate-400">
                                    <strong>Equipo:</strong>{" "}
                                    {r.team
                                        .map((pid) => roomState.players.find((p) => p.id === pid)?.name || pid)
                                        .join(", ")}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roles revelados */}
                <div className="card-glow">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Roles Revelados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {roomState.players.map((p) => {
                            const isSpy = spies.includes(p.id);
                            const isCurrentPlayer = p.id === playerId;
                            return (
                                <div
                                    key={p.id}
                                    className={`
                                        p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-3 transition-all
                                        ${isSpy
                                            ? "bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30"
                                            : "bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/30"
                                        }
                                        ${isCurrentPlayer ? "ring-2 ring-yellow-500/50" : ""}
                                    `}
                                >
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0 ${isSpy
                                        ? "bg-gradient-to-br from-red-600 to-red-700"
                                        : "bg-gradient-to-br from-blue-600 to-blue-700"
                                        }`}>
                                        {isSpy ? "🕵️" : "🛡️"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                                            <span className="truncate">{p.name}</span>
                                            {isCurrentPlayer && <span className="text-yellow-400 shrink-0">(Tú)</span>}
                                        </div>
                                        <div className={`text-xs sm:text-sm ${isSpy ? "text-red-400" : "text-blue-400"}`}>
                                            {isSpy ? "Espía" : "Resistencia"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Botón para volver */}
                <div className="text-center pb-4">
                    <button
                        onClick={() => navigate("/")}
                        className="btn-primary text-base sm:text-lg w-full sm:w-auto"
                    >
                        🏠 Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reveal;
