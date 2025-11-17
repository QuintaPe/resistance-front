import React, { useState } from "react";
import { Users, Crown, Clock, Vote, AlertTriangle, Shield, UserX, EyeOff, Check, Swords } from "lucide-react";
import type { Player } from "../types";

interface PlayerListProps {
    players: Player[];
    leaderId: string;
    currentPlayerId: string;
    phase: "lobby" | "proposeTeam" | "voteTeam" | "mission" | "reveal";
    rejectedTeams: number;
    role?: "spy" | "resistance" | null;
    otherSpies?: string[]; // IDs de otros espías
    // Progreso de votación
    votedPlayers?: string[];
    // Progreso de misión
    proposedTeam?: string[];
    playersActed?: string[];
    // Funcionalidades del creador
    isCreator?: boolean;
    onKickPlayer?: (playerId: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
    players,
    leaderId,
    currentPlayerId,
    phase,
    rejectedTeams,
    role,
    otherSpies = [],
    votedPlayers = [],
    proposedTeam = [],
    playersActed = [],
    isCreator = false,
    onKickPlayer
}) => {
    const [roleVisible, setRoleVisible] = useState(true);
    const leaderName = players.find(p => p.id === leaderId)?.name || "Desconocido";

    // Convertir IDs de espías a nombres usando la lista actual de jugadores
    const otherSpiesNames = otherSpies
        .map(spyId => players.find(p => p.id === spyId)?.name)
        .filter((name): name is string => name !== undefined);

    // Separar jugadores según la fase de misión
    const missionPlayers = phase === "mission" && proposedTeam.length > 0
        ? players.filter(p => proposedTeam.includes(p.id))
        : [];

    const otherPlayers = phase === "mission" && proposedTeam.length > 0
        ? players.filter(p => !proposedTeam.includes(p.id))
        : [];

    // Determinar qué jugadores mostrar según la fase
    const displayPlayers = phase === "mission" && proposedTeam.length > 0
        ? missionPlayers
        : players;

    // Calcular progreso según la fase
    const getProgress = () => {
        if (phase === "voteTeam" && votedPlayers.length > 0) {
            return {
                current: votedPlayers.length,
                total: players.length,
                label: "Votación",
                icon: Vote,
                waiting: players.length - votedPlayers.length
            };
        }
        if (phase === "mission" && proposedTeam.length > 0) {
            return {
                current: playersActed.length,
                total: proposedTeam.length,
                label: "Misión",
                icon: Swords,
                waiting: proposedTeam.length - playersActed.length
            };
        }
        return null;
    };

    const progress = getProgress();

    // Función para renderizar un grid de jugadores
    const renderPlayerGrid = (playersToRender: Player[], showMissionIcons: boolean = false) => (
        <div className="grid grid-cols-2 gap-2">
            {playersToRender.map((p) => {
                const isLeader = p.id === leaderId;
                const isYou = p.id === currentPlayerId;
                const canKick = isCreator && !isYou && onKickPlayer; // El creador puede expulsar a otros

                // Estado según la fase
                const hasVoted = phase === "voteTeam" && votedPlayers.includes(p.id);
                const hasActed = phase === "mission" && playersActed.includes(p.id);
                const isActive = hasVoted || hasActed;

                return (
                    <div
                        key={p.id}
                        className="relative group"
                    >
                        {/* Efecto de brillo */}
                        <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive
                            ? "bg-linear-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                            : "bg-linear-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"
                            }`}></div>

                        {/* Card del jugador */}
                        <div className={`
                            relative backdrop-blur-sm rounded-lg p-2.5 transition-all duration-300
                            ${isActive
                                ? "bg-green-500/10 border border-green-500/40 group-hover:border-green-500/60"
                                : "bg-slate-800/60 border border-slate-700/50 group-hover:border-slate-600/60"
                            }
                            ${isYou ? "ring-1 ring-blue-500/40" : ""}
                        `}>
                            <div className="flex items-center gap-2">
                                {/* Icono dinámico según fase y estado */}
                                <div className={`
                                    shrink-0 w-5 h-5 rounded flex items-center justify-center
                                    ${isActive
                                        ? "bg-linear-to-br from-green-500 to-green-600"
                                        : "bg-linear-to-br from-blue-500 to-purple-600"
                                    }
                                `}>
                                    {showMissionIcons ? (
                                        isActive ? (
                                            <Check className="w-3 h-3 text-white" />
                                        ) : (
                                            <Clock className="w-3 h-3 text-white" />
                                        )
                                    ) : phase === "voteTeam" ? (
                                        isActive ? (
                                            <Check className="w-3 h-3 text-white" />
                                        ) : (
                                            <Clock className="w-3 h-3 text-white" />
                                        )
                                    ) : isLeader ? (
                                        <Crown className="w-3 h-3 text-white" />
                                    ) : (
                                        <span className="text-white text-[10px] font-black">{players.indexOf(p) + 1}</span>
                                    )}
                                </div>
                                {/* Nombre */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold truncate ${isActive ? "text-green-300" : "text-slate-300"}`}>
                                        {p.name}
                                        {isYou && <span className="text-blue-400"> •</span>}
                                    </p>
                                </div>
                                {/* Botón de expulsar (solo visible para el creador) */}
                                {canKick && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`¿Expulsar a ${p.name}?`)) {
                                                onKickPlayer(p.id);
                                            }
                                        }}
                                        className="shrink-0 w-5 h-5 rounded bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 hover:border-red-500/60 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                        title={`Expulsar a ${p.name}`}
                                    >
                                        <UserX className="w-3 h-3 text-red-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-3">
            {/* Sección de Jugadores - Layout dinámico según fase */}
            {phase === "mission" && missionPlayers.length > 0 ? (
                <>
                    {/* Sección: Equipo en Misión */}
                    <div className="backdrop-blur-sm rounded-lg p-3 border bg-green-500/10 border-green-500/30">
                        {/* Header con información del juego */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-500/20">
                            <div className="flex items-center gap-2">
                                <Swords className="w-4 h-4 text-green-400" />
                                <span className="text-green-300 text-xs font-bold uppercase tracking-widest">En Misión</span>
                                <div className="px-2 py-0.5 bg-green-600/40 rounded">
                                    <span className="text-xs font-bold">
                                        <span className="text-green-300">{playersActed.length}</span>
                                        <span className="text-green-500">/</span>
                                        <span className="text-green-200">{missionPlayers.length}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Rechazos */}
                                {rejectedTeams > 0 && (
                                    <div className={`px-2 py-1 rounded flex items-center gap-1 ${rejectedTeams >= 3 ? "bg-red-500/20" : "bg-yellow-500/20"}`}>
                                        <AlertTriangle className={`w-3 h-3 ${rejectedTeams >= 3 ? "text-red-400" : "text-yellow-400"}`} />
                                        <span className={`text-[10px] font-bold ${rejectedTeams >= 3 ? "text-red-300" : "text-yellow-300"}`}>{rejectedTeams}/5</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Barra de progreso de misión */}
                        {playersActed.length < missionPlayers.length && (
                            <div className="mb-3">
                                <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-500 ease-out bg-linear-to-r from-green-500 via-emerald-500 to-green-600"
                                        style={{ width: `${(playersActed.length / missionPlayers.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Grid de jugadores en misión */}
                        {renderPlayerGrid(missionPlayers, true)}

                        {/* Mensaje de estado de misión */}
                        {playersActed.length < missionPlayers.length && (
                            <div className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700/40">
                                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                                <p className="text-slate-300 text-xs font-medium">
                                    Esperando <span className="font-bold text-amber-400">{missionPlayers.length - playersActed.length}</span> acción{missionPlayers.length - playersActed.length !== 1 ? "es" : ""}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sección: Resto de Jugadores */}
                    {otherPlayers.length > 0 && (
                        <div className="backdrop-blur-sm rounded-lg p-3 border bg-slate-800/60 border-slate-700/50">
                            {/* Header simple */}
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/30">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">Otros</span>
                                    <div className="px-2 py-0.5 bg-slate-700/60 rounded">
                                        <span className="text-xs font-bold text-blue-400">{otherPlayers.length}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/60 rounded">
                                    <Crown className="w-3 h-3 text-slate-300" />
                                    <span className="text-slate-300 text-[10px] font-bold">{leaderName}</span>
                                </div>
                            </div>

                            {/* Grid de otros jugadores */}
                            {renderPlayerGrid(otherPlayers, false)}
                        </div>
                    )}
                </>
            ) : (
                <div className={`backdrop-blur-sm rounded-lg p-3 border ${phase === "voteTeam"
                    ? "bg-purple-500/10 border-purple-500/30"
                    : "bg-slate-800/60 border-slate-700/50"
                    }`}>
                    {/* Header consolidado con toda la información */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/30">
                        <div className="flex items-center gap-2">
                            {progress ? (
                                <>
                                    <progress.icon className={`w-4 h-4 ${phase === "voteTeam" ? "text-purple-400" : "text-slate-400"
                                        }`} />
                                    <span className={`text-xs font-bold uppercase tracking-widest ${phase === "voteTeam" ? "text-purple-300" : "text-slate-300"
                                        }`}>
                                        {progress.label}
                                    </span>
                                    <div className={`px-2 py-0.5 rounded ${phase === "voteTeam" ? "bg-purple-600/40" : "bg-slate-700/60"
                                        }`}>
                                        <span className="text-xs font-bold">
                                            <span className="text-green-400">{progress.current}</span>
                                            <span className="text-slate-500">/</span>
                                            <span className="text-blue-400">{progress.total}</span>
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">Jugadores</span>
                                    <div className="px-2 py-0.5 bg-slate-700/60 rounded">
                                        <span className="text-xs font-bold text-blue-400">{players.length}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Líder */}
                            <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/60 rounded">
                                <Crown className="w-3 h-3 text-slate-300" />
                                <span className="text-slate-300 text-[10px] font-bold">{leaderName}</span>
                            </div>
                            {/* Rechazos */}
                            {rejectedTeams > 0 && (
                                <div className={`px-2 py-1 rounded flex items-center gap-1 ${rejectedTeams >= 3 ? "bg-red-500/20" : "bg-yellow-500/20"}`}>
                                    <AlertTriangle className={`w-3 h-3 ${rejectedTeams >= 3 ? "text-red-400" : "text-yellow-400"}`} />
                                    <span className={`text-[10px] font-bold ${rejectedTeams >= 3 ? "text-red-300" : "text-yellow-300"}`}>{rejectedTeams}/5</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    {progress && progress.current < progress.total && (
                        <div className="mb-3">
                            <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ease-out ${phase === "voteTeam"
                                        ? "bg-linear-to-r from-blue-500 via-purple-500 to-green-500"
                                        : "bg-linear-to-r from-green-500 via-emerald-500 to-green-600"
                                        }`}
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Grid de jugadores compacto con estado dinámico */}
                    {renderPlayerGrid(displayPlayers, false)}

                    {/* Mensaje de estado según progreso */}
                    {progress && progress.waiting > 0 && (
                        <div className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800/40 backdrop-blur-sm rounded-lg border border-slate-700/40">
                            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                            <p className="text-slate-300 text-xs font-medium">
                                Esperando <span className="font-bold text-amber-400">{progress.waiting}</span> {phase === "voteTeam" ? "voto" : "acción"}{progress.waiting !== 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Bloque de Rol - Separado */}
            {role && (
                <div className="backdrop-blur-sm rounded-lg border overflow-hidden bg-slate-800/60 border-slate-700/50">
                    <button
                        onClick={() => setRoleVisible(!roleVisible)}
                        className={`w-full flex items-center justify-between p-3 transition-colors ${roleVisible
                            ? (role === "spy" ? "bg-red-500/15 hover:bg-red-500/20" : "bg-blue-500/15 hover:bg-blue-500/20")
                            : "hover:bg-slate-800/80"
                            }`}
                        title={roleVisible ? "Ocultar rol" : "Mostrar rol"}
                    >
                        <div className="flex items-center gap-2.5">
                            {roleVisible ? (
                                role === "spy" ? (
                                    <>
                                        <div className="p-1.5 bg-red-500/20 rounded">
                                            <UserX className="w-4 h-4 text-red-400" />
                                        </div>
                                        <span className="text-red-300 text-sm font-bold">Tu rol: Espía</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-1.5 bg-blue-500/20 rounded">
                                            <Shield className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-blue-300 text-sm font-bold">Tu rol: Resistencia</span>
                                    </>
                                )
                            ) : (
                                <>
                                    <div className="p-1.5 bg-slate-700/60 rounded">
                                        <EyeOff className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <span className="text-slate-400 text-sm font-bold">Tu rol: ••••••••</span>
                                </>
                            )}
                        </div>
                        <EyeOff className={`w-4 h-4 ${roleVisible ? "text-slate-500" : "text-slate-600"}`} />
                    </button>

                    {/* Info de espías si aplica */}
                    {roleVisible && role === "spy" && otherSpiesNames.length > 0 && (
                        <div className="border-t border-slate-700/50 bg-red-500/5">
                            <div className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-3.5 h-3.5 text-red-400" />
                                    <span className="text-red-300 text-xs font-bold uppercase tracking-wider">Compañeros espías</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {otherSpiesNames.map((spyName, index) => (
                                        <div key={index} className="px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-md">
                                            <span className="text-red-200 text-xs font-semibold">{spyName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlayerList;

