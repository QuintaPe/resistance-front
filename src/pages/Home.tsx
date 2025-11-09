import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";

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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 animate-fadeIn">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
                {/* Logo y título */}
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-block mb-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                            <span className="text-3xl sm:text-4xl">🕵️</span>
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        The Resistance
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg">Confianza, traición y estrategia</p>
                </div>

                {/* Card principal */}
                <div className="card-glow space-y-4 sm:space-y-6">
                    {/* Input de nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Tu nombre
                        </label>
                        <input
                            type="text"
                            placeholder="Ingresa tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                            className="input-field w-full"
                            maxLength={20}
                        />
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm animate-fadeIn">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Botón crear sala */}
                    <button
                        onClick={handleCreateRoom}
                        className="btn-primary w-full text-base sm:text-lg"
                        disabled={!name.trim()}
                    >
                        🎮 Crear Nueva Sala
                    </button>

                    {/* Divisor */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-800/50 text-slate-400">O</span>
                        </div>
                    </div>

                    {/* Toggle para mostrar formulario de unirse */}
                    {!showJoinForm ? (
                        <button
                            onClick={() => setShowJoinForm(true)}
                            className="w-full text-blue-400 hover:text-blue-300 font-semibold py-2 transition-colors"
                        >
                            ¿Tienes un código? Únete a una sala →
                        </button>
                    ) : (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    Código de sala
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: ABC123"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                                    className="input-field w-full uppercase tracking-wider text-center text-xl"
                                    maxLength={6}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowJoinForm(false)}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleJoinRoom}
                                    className="btn-secondary flex-1"
                                    disabled={!name.trim() || !roomCode.trim()}
                                >
                                    Unirse
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Información adicional */}
                <div className="mt-6 sm:mt-8 text-center text-slate-500 text-xs sm:text-sm">
                    <p>Se necesitan 5-10 jugadores para comenzar</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
