import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import { Loader2, Clipboard, Check, Crown, Users, Rocket, Clock, Lightbulb, LogOut, UserX, ChevronUp } from "lucide-react";

const Lobby: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { roomState, playerId, startGame, leaveRoom, kickPlayer, changeLeader, socket } = useSocket();
    const [copied, setCopied] = useState(false);
    const [kickingPlayer, setKickingPlayer] = useState<string | null>(null);

    // Navegar automáticamente cuando el juego comience
    useEffect(() => {
        if (roomState && roomState.phase !== "lobby" && roomCode) {
            navigate(`/game/${roomCode}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomState?.phase, roomCode, navigate]);

    // Escuchar cuando nos expulsan
    useEffect(() => {
        const handleKicked = () => {
            navigate("/");
        };

        socket.on("player:kicked", handleKicked);

        return () => {
            socket.off("player:kicked", handleKicked);
        };
    }, [socket, navigate]);

    const handleCopyCode = () => {
        if (roomState?.code) {
            navigator.clipboard.writeText(roomState.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Añade handler para volver al home
    const handleGoHome = () => {
        navigate("/");
    };

    // Handler para salir de la sala
    const handleLeaveRoom = () => {
        leaveRoom();
        navigate("/");
    };

    // Handler para expulsar jugador
    const handleKickPlayer = (targetPlayerId: string, playerName: string) => {
        if (!roomCode || !roomState) return;

        if (window.confirm(`¿Estás seguro de expulsar a ${playerName}?`)) {
            setKickingPlayer(targetPlayerId);
            kickPlayer(roomCode, targetPlayerId, (ok, error) => {
                setKickingPlayer(null);
                if (!ok && error) {
                    alert(error);
                }
            });
        }
    };

    // Handler para cambiar líder
    const handleChangeLeader = (newLeaderIndex: number) => {
        if (!roomCode || !roomState) return;

        changeLeader(roomCode, newLeaderIndex, (ok, error) => {
            if (!ok && error) {
                alert(error);
            }
        });
    };

    // Detectar si soy el creador
    const isCreator = roomState?.creatorId === playerId;

    if (!roomState) {
        return (
            <div className="relative flex items-center justify-center min-h-screen overflow-hidden p-4">
                {/* Fondo animado */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                </div>

                {/* Loading con diseño táctico */}
                <div className="relative z-10 w-full max-w-md animate-fadeIn">
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"></div>

                        <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                            {/* Icono de carga */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500/30 rounded-lg blur-xl animate-pulse"></div>
                                    <div className="relative w-16 h-16 rounded-lg flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                </div>
                            </div>

                            {/* Título con estilo dossier */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="h-px flex-1 max-w-16 bg-linear-to-r from-transparent to-slate-500/50"></div>
                                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                                    Cargando
                                </h2>
                                <div className="h-px flex-1 max-w-16 bg-linear-to-l from-transparent to-slate-500/50"></div>
                            </div>

                            <p className="text-center text-slate-400 text-sm font-medium mb-6">
                                Conectando con la sala...
                            </p>

                            {/* Botón para volver a Home con estilo táctico */}
                            <button
                                onClick={handleGoHome}
                                className="w-full px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-white rounded-lg font-semibold text-sm transition-colors"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const leader = roomState.players[roomState.leaderIndex];
    const canStart = roomState.players.length >= 5 && playerId === leader.id;

    const handleStart = () => {
        if (roomCode) startGame(roomCode);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 overflow-hidden">
            {/* Fondo animado mejorado */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute top-0 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-0 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl space-y-5 sm:space-y-6 px-4 sm:px-0 animate-fadeIn">
                {/* Header con código de sala - estilo táctico */}
                <div className="relative group">
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"></div>

                    <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-700/50 text-center transition-all duration-300">

                        {/* Título con estilo dossier */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="h-px flex-1 max-w-24 bg-linear-to-r from-transparent to-slate-500/50"></div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                                Sala de Espera
                            </h1>
                            <div className="h-px flex-1 max-w-24 bg-linear-to-l from-transparent to-slate-500/50"></div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Código de sala</span>
                            </div>
                            <div className="relative group/code">
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover/code:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"></div>

                                <div className="relative bg-slate-700/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-slate-600/50 flex items-center gap-3">
                                    <span className="text-2xl sm:text-3xl font-black tracking-[0.3em] text-white">
                                        {roomState.code}
                                    </span>
                                    <button
                                        onClick={handleCopyCode}
                                        className="ml-2 p-2 hover:bg-slate-600/50 rounded transition-all duration-200 group/btn"
                                        title="Copiar código"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <Clipboard className="w-5 h-5 text-slate-400 group-hover/btn:text-white transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs font-medium">
                                {copied ? (
                                    <span className="flex items-center gap-1 text-green-400">
                                        <Check className="w-3 h-3" />
                                        ¡Código copiado!
                                    </span>
                                ) : (
                                    "Comparte este código con tus amigos"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de jugadores - estilo táctico */}
                <div className="relative group">
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0"></div>

                    <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/50">
                        {/* Header estilo dossier */}
                        <div className="flex items-center justify-center gap-3 mb-5">
                            <div className="h-px flex-1 bg-linear-to-r from-transparent to-purple-500/50"></div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded">
                                <Users className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-300 text-xs font-bold uppercase tracking-widest">Jugadores</span>
                                <div className="ml-2 px-2 py-0.5 bg-slate-800/60 rounded text-xs font-bold">
                                    <span className={roomState.players.length >= 5 ? "text-green-400" : "text-yellow-400"}>
                                        {roomState.players.length}
                                    </span>
                                    <span className="text-slate-500">/12</span>
                                </div>
                            </div>
                            <div className="h-px flex-1 bg-linear-to-l from-transparent to-purple-500/50"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
                            {roomState.players.map((p, index) => {
                                const isPlayerCreator = p.id === roomState.creatorId;
                                const isPlayerLeader = p.id === leader.id;
                                const canKickThisPlayer = isCreator && p.id !== playerId;
                                const canPromoteToLeader = isCreator && !isPlayerLeader;
                                const isKicking = kickingPlayer === p.id;

                                return (
                                    <div
                                        key={p.id}
                                        className="group/player relative"
                                    >
                                        <div className={`absolute inset-0 rounded-lg opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 ${isPlayerLeader
                                            ? "bg-linear-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0"
                                            : "bg-linear-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0"
                                            }`}></div>

                                        <div className={`
                                            relative p-3 rounded-lg flex items-center gap-3 transition-all duration-200
                                            ${isPlayerLeader
                                                ? "bg-yellow-500/15 border border-yellow-500/40"
                                                : "bg-slate-700/40 border border-slate-600/40"
                                            }
                                        `}>
                                            <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold shrink-0 ${isPlayerLeader
                                                ? "bg-linear-to-br from-yellow-500 to-orange-500 text-white"
                                                : "bg-linear-to-br from-blue-500 to-purple-500 text-white"
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate text-sm text-white flex items-center gap-1.5">
                                                    {p.name}
                                                    {p.id === playerId && <span className="text-blue-400 text-xs font-bold">(Tú)</span>}
                                                    {isPlayerCreator && <span className="text-xs" title="Creador de la sala">👑</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {isPlayerLeader && (
                                                    <Crown className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />
                                                )}
                                                {canPromoteToLeader && (
                                                    <button
                                                        onClick={() => handleChangeLeader(index)}
                                                        className="p-1 rounded hover:bg-yellow-500/20 transition-colors group/promote"
                                                        title={`Hacer líder a ${p.name}`}
                                                    >
                                                        <ChevronUp className="w-4 h-4 text-slate-500 group-hover/promote:text-yellow-400" />
                                                    </button>
                                                )}
                                                {canKickThisPlayer && (
                                                    <button
                                                        onClick={() => handleKickPlayer(p.id, p.name)}
                                                        disabled={isKicking}
                                                        className="p-1 rounded hover:bg-red-500/20 transition-colors group/kick"
                                                        title={`Expulsar a ${p.name}`}
                                                    >
                                                        <UserX className={`w-4 h-4 ${isKicking ? 'text-slate-600 animate-pulse' : 'text-slate-500 group-hover/kick:text-red-400'}`} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mensaje de estado / Botón de inicio - estilo táctico */}
                {roomState.players.length < 5 ? (
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0"></div>

                        <div className="relative backdrop-blur-sm rounded-xl p-6 border bg-yellow-500/15 border-yellow-500/40 text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded flex items-center justify-center bg-linear-to-br from-yellow-500 to-yellow-600">
                                    <Clock className="w-6 h-6 text-white animate-pulse" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-yellow-200 uppercase tracking-wide font-semibold">Estado</p>
                                    <p className="text-lg font-bold text-yellow-300">Esperando jugadores</p>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm">
                                Se necesitan al menos <span className="font-bold text-yellow-300">{5 - roomState.players.length}</span> jugador{5 - roomState.players.length > 1 ? 'es' : ''} más
                            </p>
                        </div>
                    </div>
                ) : canStart ? (
                    <button
                        onClick={handleStart}
                        className="relative w-full group overflow-hidden rounded-lg"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-green-600 to-emerald-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative px-6 py-4 flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded flex items-center justify-center bg-white/20">
                                <Rocket className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-green-200 uppercase tracking-wide font-semibold">Acción</p>
                                <p className="text-lg font-bold text-white">Iniciar Juego</p>
                            </div>
                        </div>
                    </button>
                ) : (
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"></div>

                        <div className="relative backdrop-blur-sm rounded-xl p-6 border bg-blue-500/15 border-blue-500/40 text-center">
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
                                    <Clock className="w-6 h-6 text-white animate-pulse" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-blue-200 uppercase tracking-wide font-semibold">Estado</p>
                                    <p className="text-base font-bold text-blue-300">Esperando al líder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instrucciones tácticas */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/40 backdrop-blur-sm rounded border border-slate-700/40">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-linear-to-br from-yellow-500 to-yellow-600">
                            <Lightbulb className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-300 text-xs font-semibold">
                            Mínimo 5 jugadores
                        </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/40 backdrop-blur-sm rounded border border-slate-700/40">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-linear-to-br from-orange-500 to-orange-600">
                            <Crown className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-300 text-xs font-semibold">
                            El líder inicia
                        </span>
                    </div>
                </div>

                {/* Botón para salir de la sala */}
                <button
                    onClick={handleLeaveRoom}
                    className="relative w-full group overflow-hidden rounded-lg mt-4"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-red-600 to-red-700 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative px-4 py-3 flex items-center justify-center gap-2">
                        <LogOut className="w-5 h-5 text-white" />
                        <span className="text-white font-semibold">Salir de la sala</span>
                    </div>
                </button>
            </div>

            {/* Partículas decorativas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
                <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-float animation-delay-4000"></div>
            </div>
        </div>
    );
};

export default Lobby;
