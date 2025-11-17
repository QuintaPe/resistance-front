import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import { getSessionData } from "../utils/sessionStorage";
import { User, Key, AlertTriangle, Gamepad2, Users } from "lucide-react";

const Home: React.FC = () => {
    const { createRoom, joinRoom, roomState } = useSocket();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");

    // 🔄 Redirección automática si ya hay una sesión activa
    useEffect(() => {
        // Esperar un momento para que la reconexión automática se complete
        const timer = setTimeout(() => {
            const sessionData = getSessionData();
            
            // Si hay sesión guardada Y roomState se ha cargado, redirigir
            if (sessionData.sessionId && sessionData.roomCode && roomState) {
                console.log("✅ Sesión detectada, redirigiendo a:", sessionData.roomCode);
                
                // Redirigir según la fase
                if (roomState.phase === "lobby") {
                    navigate(`/lobby/${sessionData.roomCode}`);
                } else if (roomState.phase === "reveal") {
                    navigate(`/reveal/${sessionData.roomCode}`);
                } else {
                    navigate(`/game/${sessionData.roomCode}`);
                }
            }
        }, 1000); // Esperar 1 segundo para que la reconexión se complete

        return () => clearTimeout(timer);
    }, [roomState, navigate]);

    // Crear sala
    const handleCreateRoom = () => {
        if (!name.trim()) return setError("Ingresa tu nombre");
        setError("");
        createRoom(name, (newRoomCode) => {
            navigate(`/lobby/${newRoomCode}`);
        });
    };

    // Unirse a sala existente
    const handleJoinRoom = () => {
        if (!name.trim() || !roomCode.trim()) return setError("Completa todos los campos");
        setError("");
        joinRoom(roomCode.toUpperCase(), name, (ok, err) => {
            if (ok) navigate(`/lobby/${roomCode.toUpperCase()}`);
            else setError(err || "Error al unirse a la sala");
        });
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 overflow-hidden">
            {/* Fondo animado mejorado */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradiente base */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>

                {/* Orbes de luz animados */}
                <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>

                {/* Grid decorativo */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 w-full max-w-md px-4 sm:px-0 animate-fadeIn">
                {/* Logo y título mejorado */}
                <div className="text-center mb-10 sm:mb-12">
                    <img src="/img/Hero.png" alt="The Resistance" className="w-full h-full mx-auto" />

                    <p className="text-slate-400 text-lg sm:text-xl font-medium">
                        Confianza, traición y estrategia
                    </p>

                    {/* Badges tácticos */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded">
                            <Users className="w-3 h-3 text-blue-400" />
                            <span className="text-blue-400 text-xs font-bold">5-12</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">En línea</span>
                        </div>
                    </div>
                </div>

                {/* Card principal con diseño táctico */}
                <div className="relative group">
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"></div>

                    <div className="relative backdrop-blur-xl bg-slate-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-700/50 space-y-5 sm:space-y-6 transition-all duration-300">

                        {/* Formulario de unirse a sala (Principal) */}
                        <div className="space-y-6">
                            {/* Input de nombre */}
                            <div className="relative group/input">
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 bg-linear-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0"></div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 mb-3">
                                        <div className="w-7 h-7 rounded flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Identificación</p>
                                            <p className="text-sm font-bold text-white">Tu nombre</p>
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa tu nombre"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:bg-slate-700/80 font-medium"
                                        maxLength={20}
                                    />
                                </div>
                            </div>

                            {/* Input de código de sala */}
                            <div className="relative group/input">
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 bg-linear-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0"></div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 mb-3">
                                        <div className="w-7 h-7 rounded flex items-center justify-center bg-linear-to-br from-purple-500 to-purple-600">
                                            <Key className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Acceso</p>
                                            <p className="text-sm font-bold text-white">Código de sala</p>
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ABC12"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                                        className="w-full px-4 py-4 bg-slate-700/60 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 hover:bg-slate-700/80 uppercase tracking-[0.3em] text-center text-2xl font-black"
                                        maxLength={5}
                                    />
                                </div>
                            </div>

                            {/* Mensaje de error */}
                            {error && (
                                <div className="relative group animate-fadeIn">
                                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"></div>

                                    <div className="relative backdrop-blur-sm rounded-lg p-3 border bg-red-500/15 border-red-500/40">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded flex items-center justify-center bg-linear-to-br from-red-500 to-red-600 shrink-0">
                                                <AlertTriangle className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-semibold text-red-300">{error}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Botón Unirse a sala */}
                            <button
                                onClick={handleJoinRoom}
                                className="relative w-full group overflow-hidden rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!name.trim() || !roomCode.trim()}
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative px-4 py-3 flex items-center justify-center gap-2">
                                    <Users className="w-4 h-4 text-white shrink-0" />
                                    <span className="text-sm font-semibold text-white">
                                        Unirse a Sala
                                    </span>
                                </div>
                            </button>
                        </div>

                        {/* Divisor táctico */}
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-600/50"></div>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">O</span>
                            <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-600/50"></div>
                        </div>

                        {/* Botón de crear sala */}
                        <button
                            onClick={handleCreateRoom}
                            className="relative w-full group overflow-hidden rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!name.trim()}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-blue-700 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative px-4 py-3 flex items-center justify-center gap-2">
                                <Gamepad2 className="w-4 h-4 text-white shrink-0" />
                                <span className="text-sm font-semibold text-white">
                                    Crear Nueva Sala
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Partículas decorativas (opcional) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
                <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-float animation-delay-4000"></div>
            </div>
        </div>
    );
};

export default Home;
