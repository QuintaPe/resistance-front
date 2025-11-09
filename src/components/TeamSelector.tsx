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
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {players.map((player) => {
                    const isSelected = selectedTeam.includes(player.id);
                    const canSelect = selectedTeam.length < teamSize || isSelected;

                    return (
                        <button
                            key={player.id}
                            onClick={() => togglePlayer(player.id)}
                            disabled={!canSelect}
                            className={`
                                p-2.5 sm:p-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base
                                ${isSelected
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105 shadow-lg ring-2 ring-blue-400"
                                    : canSelect
                                        ? "bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600"
                                        : "bg-slate-800/30 text-slate-600 cursor-not-allowed border border-slate-700/30"
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <span className="truncate">{player.name}</span>
                                {isSelected && (
                                    <span className="ml-1 sm:ml-2 text-lg sm:text-xl shrink-0">✓</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 sm:mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700/50 rounded-xl border border-slate-600">
                    <span className="text-slate-400 text-sm">Seleccionados:</span>
                    <span className={`font-bold text-sm sm:text-base ${selectedTeam.length === teamSize ? "text-green-400" : "text-blue-400"}`}>
                        {selectedTeam.length}/{teamSize}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TeamSelector;
