import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";

const Lobby: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { roomState, playerId, startGame } = useSocket();

    // Navegar automáticamente cuando el juego comience
    useEffect(() => {
        if (roomState && roomState.phase !== "lobby" && roomCode) {
            navigate(`/game/${roomCode}`);
        }
    }, [roomState?.phase, roomCode, navigate]);

    if (!roomState) {
        return (
            <div className="loading-screen">
                <div className="animate-pulse">
                    <div className="text-4xl mb-4">🎮</div>
                    <div>Cargando sala...</div>
                </div>
            </div>
        );
    }

    const leader = roomState.players[roomState.leaderIndex];
    const canStart = roomState.players.length >= 5 && playerId === leader.id;
    const isLeader = playerId === leader.id;

    const handleStart = () => {
        if (roomCode) startGame(roomCode);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 animate-fadeIn">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl space-y-4 sm:space-y-6 px-4 sm:px-0">
                {/* Header con código de sala */}
                <div className="card-glow text-center">
                    <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4">
                        Sala de Espera
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
                        <span className="text-slate-400 text-xs sm:text-sm">Código de sala:</span>
                        <div className="bg-slate-700/50 px-4 py-1.5 sm:px-6 sm:py-2 rounded-xl border border-slate-600">
                            <span className="text-xl sm:text-2xl font-bold tracking-widest text-white">
                                {roomState.code}
                            </span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm">Comparte este código con tus amigos</p>
                </div>

                {/* Información del líder */}
                <div className="card flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                            👑
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 uppercase tracking-wider">Líder</div>
                            <div className="font-bold text-base sm:text-lg">
                                {leader.name}
                                {isLeader && <span className="text-blue-400 ml-2">(Tú)</span>}
                            </div>
                        </div>
                    </div>
                    {isLeader && (
                        <span className="badge badge-leader">TU TURNO</span>
                    )}
                </div>

                {/* Lista de jugadores */}
                <div className="card">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl font-bold">Jugadores</h3>
                        <span className="badge bg-slate-700 text-slate-300">
                            {roomState.players.length}/10
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-80 overflow-y-auto">
                        {roomState.players.map((p, index) => (
                            <div
                                key={p.id}
                                className={`
                                    p-2.5 sm:p-3 rounded-xl flex items-center gap-2 sm:gap-3 transition-all
                                    ${p.id === leader.id 
                                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30" 
                                        : "bg-slate-700/30 border border-slate-600/30"
                                    }
                                    ${p.id === playerId ? "ring-2 ring-blue-500/50" : ""}
                                `}
                            >
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate text-sm sm:text-base">
                                        {p.name}
                                        {p.id === playerId && <span className="text-blue-400 ml-1">(Tú)</span>}
                                    </div>
                                </div>
                                {p.id === leader.id && <span className="text-lg sm:text-xl shrink-0">👑</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mensaje de estado / Botón de inicio */}
                {roomState.players.length < 5 ? (
                    <div className="card bg-yellow-500/10 border-yellow-500/30 text-center">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⏳</div>
                        <p className="text-yellow-400 font-semibold mb-1 text-sm sm:text-base">
                            Esperando más jugadores...
                        </p>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            Se necesitan al menos 5 jugadores ({5 - roomState.players.length} más)
                        </p>
                    </div>
                ) : canStart ? (
                    <button
                        onClick={handleStart}
                        className="btn-primary w-full text-lg sm:text-xl py-3 sm:py-4 animate-pulse-glow"
                    >
                        🚀 Iniciar Juego
                    </button>
                ) : (
                    <div className="card bg-blue-500/10 border-blue-500/30 text-center">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⏳</div>
                        <p className="text-blue-400 font-semibold text-sm sm:text-base">
                            Esperando al líder para iniciar el juego...
                        </p>
                    </div>
                )}

                {/* Instrucciones */}
                <div className="text-center text-slate-500 text-xs sm:text-sm space-y-1">
                    <p>• Los jugadores pueden unirse usando el código de sala</p>
                    <p className="hidden sm:block">• El líder puede iniciar cuando haya al menos 5 jugadores</p>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
