import React from "react";
import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Reveal from "./pages/Reveal";
import { useSocket } from "./context/SocketContext";

/**
 * Componente principal que define las rutas del juego.
 * El socket se inicializa desde el contexto global.
 */
const App: React.FC = () => {
    const { connected } = useSocket();

    if (!connected) {
        return (
            <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
                {/* Fondo animado */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>
                </div>

                {/* Partículas decorativas */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
                    <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float animation-delay-2000"></div>
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-float animation-delay-4000"></div>
                </div>

                {/* Contenido de carga */}
                <div className="relative z-10 text-center animate-fadeIn px-4">
                    {/* Logo animado */}
                    <div className="inline-block mb-8 relative">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 animate-pulse-glow"></div>
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                            <span className="text-5xl sm:text-6xl">🕵️</span>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-4xl sm:text-5xl font-black mb-4">
                        <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                            The Resistance
                        </span>
                    </h1>

                    {/* Mensaje de conexión */}
                    <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 shadow-2xl border border-white/10 max-w-md mx-auto">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="relative">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-white">
                                Conectando...
                            </p>
                        </div>

                        <p className="text-slate-400 text-sm sm:text-base mb-4">
                            Estableciendo conexión con el servidor
                        </p>

                        {/* Barra de carga animada */}
                        <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-shimmer w-full"></div>
                        </div>
                    </div>

                    {/* Puntos de carga */}
                    <div className="mt-8 flex gap-2 justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-2000"></div>
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-4000"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Routes>
                {/* Pantalla inicial: Crear o unirse a sala */}
                <Route path="/" element={<Home />} />

                {/* Lobby: lista de jugadores antes de iniciar */}
                <Route path="/lobby/:roomCode" element={<Lobby />} />

                {/* Juego principal: propone, vota, misión */}
                <Route path="/game/:roomCode" element={<Game />} />

                {/* Pantalla final: resultados */}
                <Route path="/reveal/:roomCode" element={<Reveal />} />

                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
};

export default App;
