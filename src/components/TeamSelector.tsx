import React from "react";
import type { Player } from "../types";

interface TeamSelectorProps {
    players: Player[];
    selectedTeam: string[];
    setSelectedTeam: (team: string[]) => void;
    teamSize: number;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
    players,
    selectedTeam,
    setSelectedTeam,
    teamSize,
}) => {
    const togglePlayer = (id: string) => {
        if (selectedTeam.includes(id)) {
            // Deseleccionar
            setSelectedTeam(selectedTeam.filter((pid) => pid !== id));
        } else {
            // Seleccionar solo si no se excede el tamaño del equipo
            if (selectedTeam.length < teamSize) {
                setSelectedTeam([...selectedTeam, id]);
            }
        }
    };

    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {players.map((p) => {
                const isSelected = selectedTeam.includes(p.id);
                return (
                    <button
                        key={p.id}
                        onClick={() => togglePlayer(p.id)}
                        className={`px-4 py-2 rounded border ${isSelected ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        {p.name}
                    </button>
                );
            })}
        </div>
    );
};

export default TeamSelector;
