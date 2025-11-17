import React from "react";
import { Users } from "lucide-react";
import type { Player } from "../../types";

interface TeamSelectorProps {
    players: Player[];
    selectedTeam: string[];
    setSelectedTeam: React.Dispatch<React.SetStateAction<string[]>>;
    teamSize: number;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
    players,
    selectedTeam,
    setSelectedTeam,
    teamSize,
}) => {
    const togglePlayer = (playerId: string) => {
        if (selectedTeam.includes(playerId)) {
            setSelectedTeam(selectedTeam.filter((id) => id !== playerId));
        } else {
            if (selectedTeam.length < teamSize) {
                setSelectedTeam([...selectedTeam, playerId]);
            }
        }
    };

    return (
        <div className="w-full max-w-lg">
            {/* Header estilo dossier */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/50"></div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Seleccionar Agentes</span>
                    <div className="ml-2 px-2 py-0.5 bg-blue-600/40 rounded">
                        <span className="text-xs font-bold text-blue-200">
                            {selectedTeam.length}/{teamSize}
                        </span>
                    </div>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/50"></div>
            </div>

            {/* Grid de jugadores */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {players.map((player, index) => {
                    const isSelected = selectedTeam.includes(player.id);
                    const canSelect = selectedTeam.length < teamSize || isSelected;

                    return (
                        <button
                            key={player.id}
                            onClick={() => togglePlayer(player.id)}
                            disabled={!canSelect}
                            className="relative group"
                        >
                            {/* Efecto de brillo */}
                            <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected
                                    ? "bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-purple-500/0"
                                    : canSelect
                                        ? "bg-gradient-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"
                                        : ""
                                }`}></div>

                            {/* Card del agente */}
                            <div className={`
                                relative backdrop-blur-sm rounded-lg p-3 transition-all duration-300
                                ${isSelected
                                    ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 scale-[1.02]"
                                    : canSelect
                                        ? "bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/60 hover:bg-slate-800/80"
                                        : "bg-slate-800/30 border border-slate-700/30 opacity-50 cursor-not-allowed"
                                }
                            `}>
                                <div className="flex items-center gap-2">
                                    {/* Número/Check */}
                                    <div className={`
                                        flex-shrink-0 w-6 h-6 rounded flex items-center justify-center
                                        ${isSelected
                                            ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                            : canSelect
                                                ? "bg-slate-700/70"
                                                : "bg-slate-800/50"
                                        }
                                    `}>
                                        {isSelected ? (
                                            <span className="text-white text-xs font-black">✓</span>
                                        ) : (
                                            <span className={`text-xs font-bold ${canSelect ? "text-slate-400" : "text-slate-600"}`}>
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                    {/* Nombre */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${isSelected
                                                ? "text-white"
                                                : canSelect
                                                    ? "text-slate-300"
                                                    : "text-slate-600"
                                            }`}>
                                            {player.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamSelector;

