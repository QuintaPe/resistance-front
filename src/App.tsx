import React from "react";
import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Reveal from "./pages/Reveal";
import { useSocket } from "./context/SocketContext";
import { UserSearch, Loader2 } from "lucide-react";
import ReconnectionNotification from "./components/ReconnectionNotification";

/**
 * Componente principal que define las rutas del juego.
 * El socket se inicializa desde el contexto global.
 */
const App: React.FC = () => {
    const { connected } = useSocket();

    if (!connected) {
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
                                        <UserSearch className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Título con estilo dossier */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="h-px flex-1 max-w-16 bg-linear-to-r from-transparent to-slate-500/50"></div>
                                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                                    Conectando
                                </h2>
                                <div className="h-px flex-1 max-w-16 bg-linear-to-l from-transparent to-slate-500/50"></div>
                            </div>

                            <p className="text-center text-slate-400 text-sm font-medium mb-4">
                                Estableciendo conexión con el servidor...
                            </p>

                            {/* Indicador de conexión */}
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                <span className="text-xs text-slate-500 font-medium">Conectando</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Notificaciones de reconexión */}
            <ReconnectionNotification />

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
