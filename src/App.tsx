import React from "react";
import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Reveal from "./pages/Reveal";
import { useSocket } from "./context";
import { LoadingScreen } from "./components/common";
import { ReconnectionNotification } from "./components/layout";
import { UserSearch } from "lucide-react";

/**
 * Componente principal que define las rutas del juego.
 * El socket se inicializa desde el contexto global.
 */
const App: React.FC = () => {
    const { connected } = useSocket();

    if (!connected) {
        return (
            <LoadingScreen
                title="Conectando"
                message="Estableciendo conexión con el servidor..."
                icon={UserSearch}
            />
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
