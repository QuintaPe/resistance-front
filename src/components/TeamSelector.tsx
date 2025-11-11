import React from "react";
import type { Player } from "../types";

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
            <div className="grid grid-cols-2 gap-3">
                {players.map((player) => {
                    const isSelected = selectedTeam.includes(player.id);
                    const canSelect = selectedTeam.length < teamSize || isSelected;

                    return (
                        <button
                            key={player.id}
                            onClick={() => togglePlayer(player.id)}
                            disabled={!canSelect}
                            className={`
                                relative group p-3.5 sm:p-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base overflow-hidden
                                ${isSelected
                                    ? "scale-[1.03] shadow-xl ring-2 ring-blue-400/50"
                                    : canSelect
                                        ? "hover:scale-[1.02] hover:shadow-lg"
                                        : "cursor-not-allowed opacity-40"
                                }
                            `}
                        >
                            {/* Fondo */}
                            {isSelected ? (
                                <>
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-400/0 via-white/20 to-blue-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                </>
                            ) : canSelect ? (
                                <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl group-hover:bg-slate-700/50 group-hover:border-slate-600/70 transition-all"></div>
                            ) : (
                                <div className="absolute inset-0 bg-slate-800/20 border border-slate-700/30 rounded-xl"></div>
                            )}

                            {/* Contenido */}
                            <div className="relative flex items-center justify-between">
                                <span className={`truncate ${isSelected ? "text-white" : canSelect ? "text-slate-300 group-hover:text-white" : "text-slate-600"}`}>
                                    {player.name}
                                </span>
                                {isSelected && (
                                    <span className="ml-2 text-xl text-white shrink-0 animate-pulse">✓</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>


        </div>
    );
};

export default TeamSelector;
