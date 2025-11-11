import React from "react";
import type { Player } from "../types";

interface PlayerListProps {
    players: Player[];
    leaderId: string;
    currentPlayerId: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, leaderId, currentPlayerId }) => {
    return (
        <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-5 shadow-xl border border-white/10 w-full max-w-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <h3 className="text-lg font-bold text-white">Jugadores</h3>
                </div>
                <div className="px-3 py-1 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full">
                    <span className="text-sm font-bold text-blue-400">{players.length}</span>
                </div>
            </div>

            {/* Lista de jugadores */}
            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                {players.map((p, index) => {
                    const isLeader = p.id === leaderId;
                    const isYou = p.id === currentPlayerId;
                    return (
                        <div
                            key={p.id}
                            className={`
                                relative p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]
                                ${isLeader
                                    ? "bg-linear-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40"
                                    : "bg-slate-800/40 border border-slate-700/40"
                                }
                                ${isYou ? "ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20" : ""}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                        isLeader
                                            ? "bg-linear-to-br from-yellow-500 to-orange-500 text-white"
                                            : "bg-linear-to-br from-blue-500 to-purple-500 text-white"
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">
                                            {p.name}
                                            {isYou && <span className="text-blue-400 ml-1.5 text-sm">(Tú)</span>}
                                        </div>
                                    </div>
                                </div>
                                {isLeader && (
                                    <span className="text-xl shrink-0 animate-pulse">👑</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerList;
