import React from "react";
import { Clock, Users, Vote, Target, Trophy, Crown, AlertTriangle, Shield, UserX } from "lucide-react";

interface GameStatusProps {
    leader: string;
    phase: "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";
    rejectedTeams: number;
    role?: "spy" | "resistance" | null;
    otherSpies?: string[];
}

const GameStatus: React.FC<GameStatusProps> = ({ leader, phase, rejectedTeams, role, otherSpies = [] }) => {
    const phaseConfig = {
        lobby: { label: "Esperando jugadores", Icon: Clock, iconColor: "text-slate-400", textColor: "text-slate-400", bg: "bg-slate-500/15", border: "border-slate-500/30" },
        proposeTeam: { label: "Proponiendo equipo", Icon: Users, iconColor: "text-blue-400", textColor: "text-blue-300", bg: "bg-blue-500/15", border: "border-blue-500/40" },
        voteTeam: { label: "Votando equipo", Icon: Vote, iconColor: "text-purple-400", textColor: "text-purple-300", bg: "bg-purple-500/15", border: "border-purple-500/40" },
        mission: { label: "Misión en curso", Icon: Target, iconColor: "text-green-400", textColor: "text-green-300", bg: "bg-green-500/15", border: "border-green-500/40" },
        reveal: { label: "Revelando resultados", Icon: Trophy, iconColor: "text-yellow-400", textColor: "text-yellow-300", bg: "bg-yellow-500/15", border: "border-yellow-500/40" },
    }[phase];

    return (
        <div className="space-y-3">
            {/* Fase Actual */}
            <div className="relative group">
                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${phase === "proposeTeam" ? "bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0" :
                    phase === "voteTeam" ? "bg-linear-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0" :
                        phase === "mission" ? "bg-linear-to-r from-green-500/0 via-green-500/10 to-green-500/0" :
                            "bg-linear-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"
                    }`}></div>

                <div className={`relative backdrop-blur-sm rounded-lg p-2.5 border transition-all duration-300 ${phaseConfig.bg} ${phaseConfig.border}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${phase === "proposeTeam" ? "bg-linear-to-br from-blue-500 to-blue-600" :
                            phase === "voteTeam" ? "bg-linear-to-br from-purple-500 to-purple-600" :
                                phase === "mission" ? "bg-linear-to-br from-green-500 to-green-600" :
                                    "bg-slate-700/70"
                            }`}>
                            <phaseConfig.Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Fase</p>
                            <p className={`text-sm font-bold ${phaseConfig.textColor}`}>
                                {phaseConfig.label}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Líder Actual */}
            <div className="relative group">
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0"></div>

                <div className="relative backdrop-blur-sm rounded-lg p-2.5 border bg-yellow-500/15 border-yellow-500/40 transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded flex items-center justify-center bg-linear-to-br from-yellow-500 to-orange-500">
                            <Crown className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Líder</p>
                            <p className="text-sm font-bold text-yellow-300">
                                {leader}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rechazos Consecutivos */}
            {rejectedTeams > 0 && (
                <div className="relative group">
                    <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${rejectedTeams >= 3
                        ? "bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"
                        : "bg-linear-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0"
                        }`}></div>

                    <div className={`relative backdrop-blur-sm rounded-lg p-2.5 border transition-all duration-300 ${rejectedTeams >= 3
                        ? "bg-red-500/15 border-red-500/40"
                        : "bg-yellow-500/15 border-yellow-500/40"
                        }`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded flex items-center justify-center ${rejectedTeams >= 3
                                ? "bg-linear-to-br from-red-500 to-red-600"
                                : "bg-linear-to-br from-yellow-500 to-orange-500"
                                }`}>
                                <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Rechazos</p>
                                <p className={`text-sm font-bold ${rejectedTeams >= 3 ? "text-red-300" : "text-yellow-300"}`}>
                                    {rejectedTeams} de 5
                                </p>
                            </div>
                        </div>
                        {rejectedTeams >= 3 && (
                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-300 bg-red-500/20 px-2 py-1.5 rounded border border-red-500/30">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="font-semibold">¡Peligro! Los espías ganan con 5</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tu Rol */}
            <div className="relative group">
                {role && (
                    <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${role === "spy"
                        ? "bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"
                        : "bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"
                        }`}></div>
                )}

                {role ? (
                    <div className={`relative backdrop-blur-sm rounded-lg p-2.5 border transition-all duration-300 ${role === "spy"
                        ? "bg-red-500/15 border-red-500/40"
                        : "bg-blue-500/15 border-blue-500/40"
                        }`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded flex items-center justify-center ${role === "spy"
                                ? "bg-linear-to-br from-red-500 to-red-600"
                                : "bg-linear-to-br from-blue-500 to-blue-600"
                                }`}>
                                {role === "spy" ? (
                                    <UserX className="w-4 h-4 text-white" />
                                ) : (
                                    <Shield className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Tu Rol</p>
                                <p className={`text-sm font-bold ${role === "spy" ? "text-red-300" : "text-blue-300"}`}>
                                    {role === "spy" ? "Espía" : "Resistencia"}
                                </p>
                            </div>
                        </div>

                        {role === "spy" && otherSpies.length > 0 && (
                            <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded">
                                <div className="flex items-center gap-1.5 text-red-300 font-semibold mb-1 text-[10px]">
                                    <Users className="w-3 h-3" />
                                    <span>Compañeros:</span>
                                </div>
                                <div className="text-xs text-red-200 font-medium">{otherSpies.join(", ")}</div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative backdrop-blur-sm rounded-lg p-2.5 border bg-slate-800/60 border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />
                            <span className="text-yellow-300 text-sm font-medium">Esperando rol...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameStatus;
