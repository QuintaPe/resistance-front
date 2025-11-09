import React from "react";

interface GameStatusProps {
    leader: string;
    phase: "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";
    rejectedTeams: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ leader, phase, rejectedTeams }) => {
    const phaseLabel = {
        lobby: "Esperando jugadores",
        proposeTeam: "Proponiendo equipo",
        voteTeam: "Votando equipo",
        mission: "Misión en curso",
        reveal: "Revelando resultados",
    }[phase];

    return (
        <div className="flex flex-col items-center gap-1 border p-3 rounded w-72 bg-gray-100">
            <p>
                <span className="font-semibold">Fase:</span> {phaseLabel}
            </p>
            <p>
                <span className="font-semibold">Líder actual:</span> {leader}
            </p>
            <p>
                <span className="font-semibold">Equipos rechazados consecutivos:</span> {rejectedTeams}
            </p>
        </div>
    );
};

export default GameStatus;
