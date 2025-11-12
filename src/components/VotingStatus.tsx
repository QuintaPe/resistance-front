import React from "react";
import { Check, Clock, Vote } from "lucide-react";
import type { Player } from "../types";

interface VotingStatusProps {
    players: Player[];
    votedPlayers: string[];
    currentPlayerId: string;
}

const VotingStatus: React.FC<VotingStatusProps> = ({
    players,
    votedPlayers,
    currentPlayerId
}) => {
    const votedCount = votedPlayers.length;
    const totalPlayers = players.length;

    return (
        <div className="w-full max-w-lg">
            {/* Header estilo dossier */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-500/50"></div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/60 border border-slate-700/40 rounded">
                    <Vote className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">Progreso de Votación</span>
                    <div className="ml-2 px-2 py-0.5 bg-slate-700/60 rounded">
                        <span className="text-xs font-bold">
                            <span className="text-green-400">{votedCount}</span>
                            <span className="text-slate-500">/</span>
                            <span className="text-blue-400">{totalPlayers}</span>
                        </span>
                    </div>
                </div>
                <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-500/50"></div>
            </div>

            {/* Barra de progreso compacta */}
            <div className="mb-4">
                <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 ease-out"
                        style={{ width: `${(votedCount / totalPlayers) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Grid de jugadores compacto */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {players.map((player) => {
                    const hasVoted = votedPlayers.includes(player.id);
                    const isYou = player.id === currentPlayerId;

                    return (
                        <div
                            key={player.id}
                            className="relative group"
                        >
                            {/* Efecto de brillo */}
                            <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${hasVoted
                                    ? "bg-linear-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                                    : "bg-linear-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"
                                }`}></div>

                            {/* Card del jugador */}
                            <div className={`
                                relative backdrop-blur-sm rounded-lg p-2.5 transition-all duration-300
                                ${hasVoted
                                    ? "bg-green-500/10 border border-green-500/40 group-hover:border-green-500/60"
                                    : "bg-slate-800/60 border border-slate-700/50 group-hover:border-slate-600/60"
                                }
                                ${isYou ? "ring-1 ring-blue-500/40" : ""}
                            `}>
                                <div className="flex items-center gap-2">
                                    {/* Icono de estado */}
                                    <div className={`
                                        shrink-0 w-5 h-5 rounded flex items-center justify-center
                                        ${hasVoted
                                            ? "bg-linear-to-br from-green-500 to-green-600"
                                            : "bg-slate-700/70"
                                        }
                                    `}>
                                        {hasVoted ? (
                                            <Check className="w-3 h-3 text-white" />
                                        ) : (
                                            <Clock className="w-3 h-3 text-slate-400" />
                                        )}
                                    </div>
                                    {/* Nombre */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold truncate ${hasVoted ? "text-green-300" : "text-slate-300"
                                            }`}>
                                            {player.name}
                                            {isYou && <span className="text-blue-400"> •</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mensaje de estado compacto */}
            {votedCount < totalPlayers && (
                <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700/40">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <p className="text-slate-300 text-xs font-medium">
                        Esperando <span className="font-bold text-amber-400">{totalPlayers - votedCount}</span> voto{totalPlayers - votedCount !== 1 ? "s" : ""}
                    </p>
                </div>
            )}
        </div>
    );
};

export default VotingStatus;

