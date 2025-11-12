import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import { User, Key, AlertTriangle, Gamepad2, Lightbulb } from "lucide-react";

const Home: React.FC = () => {
    const { createRoom, joinRoom } = useSocket();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const [showJoinForm, setShowJoinForm] = useState(false);

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

                    {/* Badges decorativos */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold">
                            5-12 jugadores
                        </span>
                        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold">
                            En línea
                        </span>
                    </div>
                </div>

                {/* Card principal con glassmorphism mejorado */}
                <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 space-y-5 sm:space-y-6 hover:shadow-blue-500/10 hover:shadow-3xl transition-all duration-300">
                    {/* Efecto de brillo superior */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                    {/* Input de nombre mejorado */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                            <User className="w-4 h-4" />
                            <span>Tu nombre</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ingresa tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !showJoinForm && handleCreateRoom()}
                            className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm hover:bg-slate-800/70"
                            maxLength={20}
                        />
                    </div>

                    {/* Mensaje de error mejorado */}
                    {error && (
                        <div className="relative overflow-hidden bg-red-500/10 border border-red-500/50 rounded-xl p-4 animate-fadeIn">
                            <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-red-500/5 to-red-500/0 animate-shimmer"></div>
                            <div className="relative flex items-center gap-2 text-red-400 text-sm font-medium">
                                <AlertTriangle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Botón crear sala mejorado */}
                    <button
                        onClick={handleCreateRoom}
                        className="relative w-full group overflow-hidden"
                        disabled={!name.trim()}
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-blue-500 to-purple-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-blue-400/0 via-white/20 to-blue-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            <Gamepad2 className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                            <span>Crear Nueva Sala</span>
                        </div>
                    </button>

                    {/* Divisor elegante */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700/50"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-slate-800/80 backdrop-blur-sm text-slate-400 text-sm font-semibold rounded-full border border-slate-700/50">
                                O
                            </span>
                        </div>
                    </div>

                    {/* Toggle/Formulario de unirse mejorado */}
                    {!showJoinForm ? (
                        <button
                            onClick={() => setShowJoinForm(true)}
                            className="group w-full flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 font-semibold py-3 rounded-xl hover:bg-blue-500/5 transition-all duration-200"
                        >
                            <span>¿Tienes un código? Únete a una sala</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                        </button>
                    ) : (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-3">
                                    <Key className="w-4 h-4" />
                                    <span>Código de sala</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="ABC123"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                                    className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm hover:bg-slate-800/70 uppercase tracking-[0.3em] text-center text-2xl font-bold"
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowJoinForm(false);
                                        setRoomCode("");
                                        setError("");
                                    }}
                                    className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleJoinRoom}
                                    className="relative flex-1 group overflow-hidden"
                                    disabled={!name.trim() || !roomCode.trim()}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-purple-500 to-pink-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                                    <div className="relative px-6 py-3.5 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 group-hover:scale-105 active:scale-95">
                                        Unirse
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
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
