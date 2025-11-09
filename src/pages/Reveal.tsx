import React from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import MissionTracker from "../components/MissionTracker";

const Reveal: React.FC = () => {
    const navigate = useNavigate();
    const { roomState, spies, playerId } = useSocket();

    if (!roomState) {
        return (
            <div className="flex h-screen items-center justify-center">
                Cargando resultados...
            </div>
        );
    }

    const passedMissions = roomState.results.filter((r) => r.passed).length;
    const failedMissions = roomState.results.filter((r) => !r.passed).length;

    let winner = "";
    if (roomState.rejectedTeamsInRow >= 5 || failedMissions >= 3) winner = "Espías";
    else if (passedMissions >= 3) winner = "Resistencia";

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-6 gap-6">
            <h1 className="text-3xl font-bold">Resultados Finales</h1>

            <p className="text-xl">
                Ganador: <span className="font-semibold">{winner}</span>
            </p>

            {/* Tracker de misiones */}
            <MissionTracker total={5} results={roomState.results} />

            <div className="flex flex-col items-center gap-2 mt-4 border p-4 rounded w-80">
                <h2 className="text-lg font-semibold">Historial de misiones</h2>
                {roomState.results.map((r, idx) => (
                    <div
                        key={idx}
                        className={`p-1 rounded ${r.passed ? "bg-green-200" : "bg-red-200"
                            }`}
                    >
                        Misión {idx + 1}: {r.passed ? "✅ Éxito" : "❌ Fallo"} | Equipo:{" "}
                        {r.team
                            .map((pid) => roomState.players.find((p) => p.id === pid)?.name || pid)
                            .join(", ")}
                        {r.fails > 0 && ` | Fallos: ${r.fails}`}
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-2 mt-4 border p-4 rounded w-80">
                <h2 className="text-lg font-semibold">Roles de jugadores</h2>
                {roomState.players.map((p) => {
                    const isSpy = spies.includes(p.id);
                    const roleDisplay = isSpy ? "Espía" : "Resistencia";
                    const highlight = p.id === playerId ? "bg-yellow-200" : "";
                    return (
                        <div
                            key={p.id}
                            className={`p-1 rounded bg-gray-100 ${highlight}`}
                        >
                            {p.name}: {roleDisplay} {isSpy && "🕵️"}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4"
            >
                Volver al Inicio
            </button>
        </div>
    );
};

export default Reveal;
