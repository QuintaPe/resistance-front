import React from "react";

interface GameStatusProps {
    leader: string;
    phase: "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";
    rejectedTeams: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ leader, phase, rejectedTeams }) => {
    const phaseConfig = {
        lobby: { label: "Esperando jugadores", icon: "⏳", color: "text-slate-400" },
        proposeTeam: { label: "Proponiendo equipo", icon: "👥", color: "text-blue-400" },
        voteTeam: { label: "Votando equipo", icon: "🗳️", color: "text-purple-400" },
        mission: { label: "Misión en curso", icon: "🎯", color: "text-green-400" },
        reveal: { label: "Revelando resultados", icon: "🏆", color: "text-yellow-400" },
    }[phase];

    return (
        <div className="space-y-3">
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Fase Actual</div>
                <div className={`flex items-center gap-2 font-bold ${phaseConfig.color}`}>
                    <span className="text-xl">{phaseConfig.icon}</span>
                    <span>{phaseConfig.label}</span>
                </div>
            </div>

            <div className="h-px bg-slate-700"></div>

            <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Líder Actual</div>
                <div className="flex items-center gap-2">
                    <span className="text-xl">👑</span>
                    <span className="font-semibold">{leader}</span>
                </div>
            </div>

            {rejectedTeams > 0 && (
                <>
                    <div className="h-px bg-slate-700"></div>
                    <div className={`${rejectedTeams >= 3 ? "text-red-400" : "text-yellow-400"}`}>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Rechazos Consecutivos</div>
                        <div className="flex items-center gap-2 font-bold">
                            <span className="text-xl">⚠️</span>
                            <span>{rejectedTeams}/5</span>
                        </div>
                        {rejectedTeams >= 3 && (
                            <div className="text-xs mt-1 text-red-300">
                                ¡Peligro! Los espías ganan con 5 rechazos
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameStatus;
