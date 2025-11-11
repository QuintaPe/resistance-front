import React from "react";
import { Clock, Users, Vote, Target, Trophy, MapPin, Crown, AlertTriangle } from "lucide-react";

interface GameStatusProps {
    leader: string;
    phase: "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";
    rejectedTeams: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ leader, phase, rejectedTeams }) => {
    const phaseConfig = {
        lobby: { label: "Esperando jugadores", Icon: Clock, color: "text-slate-400", bg: "bg-slate-500/20" },
        proposeTeam: { label: "Proponiendo equipo", Icon: Users, color: "text-blue-400", bg: "bg-blue-500/20" },
        voteTeam: { label: "Votando equipo", Icon: Vote, color: "text-purple-400", bg: "bg-purple-500/20" },
        mission: { label: "Misión en curso", Icon: Target, color: "text-green-400", bg: "bg-green-500/20" },
        reveal: { label: "Revelando resultados", Icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/20" },
    }[phase];

    return (
        <div className="space-y-4">
            {/* Fase Actual */}
            <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>Fase Actual</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-xl ${phaseConfig.bg} border border-white/10 transition-all duration-300 hover:scale-[1.02]`}>
                    <phaseConfig.Icon className="w-6 h-6" />
                    <div className={`font-bold text-base ${phaseConfig.color}`}>
                        {phaseConfig.label}
                    </div>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

            {/* Líder Actual */}
            <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
                    <Crown className="w-3 h-3" />
                    <span>Líder Actual</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 transition-all duration-300 hover:scale-[1.02]">
                    <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                    <div className="font-bold text-base text-yellow-400">
                        {leader}
                    </div>
                </div>
            </div>

            {/* Rechazos Consecutivos */}
            {rejectedTeams > 0 && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Rechazos Consecutivos</span>
                        </div>
                        <div className={`p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                            rejectedTeams >= 3 
                                ? "bg-red-500/20 border-red-500/40" 
                                : "bg-yellow-500/20 border-yellow-500/40"
                        }`}>
                            <div className={`flex items-center gap-3 font-bold text-lg ${
                                rejectedTeams >= 3 ? "text-red-400" : "text-yellow-400"
                            }`}>
                                <AlertTriangle className="w-6 h-6 animate-pulse" />
                                <span>{rejectedTeams}/5</span>
                            </div>
                            {rejectedTeams >= 3 && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-red-300 bg-red-500/20 px-3 py-2 rounded-lg border border-red-500/30">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="font-semibold">¡Peligro! Los espías ganan con 5 rechazos</span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default GameStatus;
