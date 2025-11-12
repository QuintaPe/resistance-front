import React from "react";
import { Users, Crown } from "lucide-react";
import type { Player } from "../types";

interface PlayerListProps {
    players: Player[];
    leaderId: string;
    currentPlayerId: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, leaderId, currentPlayerId }) => {
    return (
        <div className="w-full max-w-lg">
            {/* Header estilo dossier */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-500/50"></div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/60 border border-slate-700/40 rounded">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">Jugadores</span>
                    <div className="ml-2 px-2 py-0.5 bg-slate-700/60 rounded">
                        <span className="text-xs font-bold text-blue-400">{players.length}</span>
                    </div>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-500/50"></div>
            </div>

            {/* Grid de jugadores compacto */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {players.map((p, index) => {
                    const isLeader = p.id === leaderId;
                    const isYou = p.id === currentPlayerId;
                    
                    return (
                        <div
                            key={p.id}
                            className="relative group"
                        >
                            {/* Efecto de brillo */}
                            <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                isLeader 
                                    ? "bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0"
                                    : "bg-gradient-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"
                            }`}></div>
                            
                            {/* Card del jugador */}
                            <div className={`
                                relative backdrop-blur-sm rounded-lg p-2.5 transition-all duration-300
                                ${isLeader
                                    ? "bg-yellow-500/10 border border-yellow-500/40 group-hover:border-yellow-500/60"
                                    : "bg-slate-800/60 border border-slate-700/50 group-hover:border-slate-600/60"
                                }
                                ${isYou ? "ring-1 ring-blue-500/40" : ""}
                            `}>
                                <div className="flex items-center gap-2">
                                    {/* Número/Corona */}
                                    <div className={`
                                        flex-shrink-0 w-5 h-5 rounded flex items-center justify-center
                                        ${isLeader
                                            ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                                            : "bg-gradient-to-br from-blue-500 to-purple-600"
                                        }
                                    `}>
                                        {isLeader ? (
                                            <Crown className="w-3 h-3 text-white" />
                                        ) : (
                                            <span className="text-white text-[10px] font-black">{index + 1}</span>
                                        )}
                                    </div>
                                    {/* Nombre */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold truncate ${
                                            isLeader ? "text-yellow-300" : "text-slate-300"
                                        }`}>
                                            {p.name}
                                            {isYou && <span className="text-blue-400"> •</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerList;
