import React from "react";
import { Clock, Users, Vote, Target, Trophy, MapPin, Crown, AlertTriangle, Shield, UserX } from "lucide-react";

interface GameStatusProps {
    leader: string;
    phase: "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";
    rejectedTeams: number;
    role?: "spy" | "resistance" | null;
    otherSpies?: string[];
}

const GameStatus: React.FC<GameStatusProps> = ({ leader, phase, rejectedTeams, role, otherSpies = [] }) => {
    const phaseConfig = {
        lobby: { label: "Esperando jugadores", Icon: Clock, iconColor: "text-slate-400", textColor: "text-slate-400", bg: "bg-slate-500/20" },
        proposeTeam: { label: "Proponiendo equipo", Icon: Users, iconColor: "text-blue-400", textColor: "text-blue-400", bg: "bg-blue-500/20" },
        voteTeam: { label: "Votando equipo", Icon: Vote, iconColor: "text-purple-400", textColor: "text-purple-400", bg: "bg-purple-500/20" },
        mission: { label: "Misión en curso", Icon: Target, iconColor: "text-green-400", textColor: "text-green-400", bg: "bg-green-500/20" },
        reveal: { label: "Revelando resultados", Icon: Trophy, iconColor: "text-yellow-400", textColor: "text-yellow-400", bg: "bg-yellow-500/20" },
    }[phase];

    return (
        <div className="space-y-2 sm:space-y-4">
            {/* Fase Actual */}
            <div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 sm:mb-2">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Fase Actual</span>
                </div>
                <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl ${phaseConfig.bg} border border-white/10 transition-all duration-300 hover:scale-[1.02]`}>
                    <phaseConfig.Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${phaseConfig.iconColor}`} />
                    <div className={`font-bold text-sm sm:text-base ${phaseConfig.textColor}`}>
                        {phaseConfig.label}
                    </div>
                </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent"></div>

            {/* Líder Actual */}
            <div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 sm:mb-2">
                    <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Líder Actual</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-yellow-500/10 border border-yellow-500/30 transition-all duration-300 hover:scale-[1.02]">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
                    <div className="font-bold text-sm sm:text-base text-yellow-400">
                        {leader}
                    </div>
                </div>
            </div>

            {/* Rechazos Consecutivos */}
            {rejectedTeams > 0 && (
                <>
                    <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent"></div>
                    <div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 sm:mb-2">
                            <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span>Rechazos</span>
                        </div>
                        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-300 hover:scale-[1.02] ${rejectedTeams >= 3
                            ? "bg-red-500/20 border-red-500/40"
                            : "bg-yellow-500/20 border-yellow-500/40"
                            }`}>
                            <div className={`flex items-center gap-2 sm:gap-3 font-bold text-base sm:text-lg ${rejectedTeams >= 3 ? "text-red-400" : "text-yellow-400"
                                }`}>
                                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                                <span>{rejectedTeams}/5</span>
                            </div>
                            {rejectedTeams >= 3 && (
                                <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-red-300 bg-red-500/20 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-red-500/30">
                                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="font-semibold">¡Peligro! Los espías ganan con 5 rechazos</span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent"></div>

            {/* Tu Rol */}
            <div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 sm:mb-2">
                    {role === "spy" ? (
                        <UserX className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    ) : (
                        <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    )}
                    <span>Tu Rol</span>
                </div>
                {role ? (
                    <div>
                        <div className="relative group overflow-hidden rounded-lg sm:rounded-xl inline-block">
                            <div className={`absolute inset-0 ${role === "spy"
                                ? "bg-linear-to-r from-red-600 to-red-700"
                                : "bg-linear-to-r from-blue-600 to-blue-700"
                                } opacity-90 group-hover:opacity-100 transition-opacity duration-200`}></div>
                            <div className="relative px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 font-bold text-base sm:text-lg">
                                {role === "spy" ? (
                                    <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                ) : (
                                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                )}
                                <span className="text-white">{role === "spy" ? "Espía" : "Resistencia"}</span>
                            </div>
                        </div>
                        {role === "spy" && otherSpies.length > 0 && (
                            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-red-500/20 border border-red-500/30 rounded-lg sm:rounded-xl">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-red-300 font-semibold mb-1 sm:mb-1.5 text-xs sm:text-sm">
                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span>Compañeros:</span>
                                </div>
                                <div className="text-xs sm:text-sm text-red-200 font-medium">{otherSpies.join(", ")}</div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg sm:rounded-xl">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse" />
                        <span className="text-yellow-400 text-xs sm:text-sm font-medium">Esperando rol...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameStatus;
