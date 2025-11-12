import React from "react";
import { Check, Clock, Swords } from "lucide-react";
import type { Player } from "../types";

interface MissionStatusProps {
    teamMembers: string[]; // IDs de los miembros del equipo
    players: Player[];
    playersActed: string[];
    currentPlayerId: string;
}

const MissionStatus: React.FC<MissionStatusProps> = ({ 
    teamMembers, 
    players,
    playersActed, 
    currentPlayerId 
}) => {
    const actedCount = playersActed.length;
    const totalMembers = teamMembers.length;

    // Filtrar solo los jugadores del equipo
    const teamPlayers = players.filter(p => teamMembers.includes(p.id));

    return (
        <div className="w-full max-w-lg">
            {/* Header estilo dossier */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-green-500/50"></div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded">
                    <Swords className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-xs font-bold uppercase tracking-widest">Progreso de Misión</span>
                    <div className="ml-2 px-2 py-0.5 bg-green-600/40 rounded">
                        <span className="text-xs font-bold">
                            <span className="text-green-300">{actedCount}</span>
                            <span className="text-green-500">/</span>
                            <span className="text-green-200">{totalMembers}</span>
                        </span>
                    </div>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-green-500/50"></div>
            </div>

            {/* Barra de progreso compacta */}
            <div className="mb-4">
                <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 transition-all duration-500 ease-out"
                        style={{ width: `${(actedCount / totalMembers) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Grid de agentes compacto */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {teamPlayers.map((player) => {
                    const hasActed = playersActed.includes(player.id);
                    const isYou = player.id === currentPlayerId;
                    
                    return (
                        <div
                            key={player.id}
                            className="relative group"
                        >
                            {/* Efecto de brillo */}
                            <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                hasActed 
                                    ? "bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                                    : "bg-gradient-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"
                            }`}></div>
                            
                            {/* Card del agente */}
                            <div className={`
                                relative backdrop-blur-sm rounded-lg p-2.5 transition-all duration-300
                                ${hasActed
                                    ? "bg-green-500/10 border border-green-500/40 group-hover:border-green-500/60"
                                    : "bg-slate-800/60 border border-slate-700/50 group-hover:border-slate-600/60"
                                }
                                ${isYou ? "ring-1 ring-blue-500/40" : ""}
                            `}>
                                <div className="flex items-center gap-2">
                                    {/* Icono de estado */}
                                    <div className={`
                                        flex-shrink-0 w-5 h-5 rounded flex items-center justify-center
                                        ${hasActed
                                            ? "bg-gradient-to-br from-green-500 to-green-600"
                                            : "bg-slate-700/70"
                                        }
                                    `}>
                                        {hasActed ? (
                                            <Check className="w-3 h-3 text-white" />
                                        ) : (
                                            <Clock className="w-3 h-3 text-slate-400" />
                                        )}
                                    </div>
                                    {/* Nombre */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold truncate ${
                                            hasActed ? "text-green-300" : "text-slate-300"
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
            {actedCount < totalMembers && (
                <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700/40">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <p className="text-slate-300 text-xs font-medium">
                        Esperando <span className="font-bold text-amber-400">{totalMembers - actedCount}</span> acción{totalMembers - actedCount !== 1 ? "es" : ""}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MissionStatus;

