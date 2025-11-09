import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";

const Lobby: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { roomState, playerId, startGame } = useSocket();

    // Navegar automáticamente cuando el juego comience
    useEffect(() => {
        if (roomState && roomState.phase !== "lobby" && roomCode) {
            navigate(`/game/${roomCode}`);
        }
    }, [roomState?.phase, roomCode, navigate]);

    if (!roomState) {
        return (
            <div className="flex h-screen items-center justify-center">
                Cargando sala...
            </div>
        );
    }

    const leader = roomState.players[roomState.leaderIndex];

    const canStart = roomState.players.length >= 5 && playerId === leader.id;

    const handleStart = () => {
        if (roomCode) startGame(roomCode);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <h1 className="text-3xl font-bold">Sala: {roomState.code}</h1>
            <h2 className="text-xl">
                Líder actual: {leader.name} {playerId === leader.id ? "(Tú)" : ""}
            </h2>

            <div className="flex flex-col gap-2 border p-4 rounded w-72">
                <h3 className="font-semibold">Jugadores ({roomState.players.length})</h3>
                {roomState.players.map((p) => (
                    <div
                        key={p.id}
                        className={`p-1 rounded ${p.id === leader.id ? "bg-yellow-200 font-bold" : "bg-gray-100"
                            }`}
                    >
                        {p.name} {p.id === playerId ? "(Tú)" : ""}
                    </div>
                ))}
            </div>

            {canStart ? (
                <button
                    onClick={handleStart}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4"
                >
                    Iniciar Juego
                </button>
            ) : (
                <div className="mt-4 text-gray-600">
                    Esperando al líder para iniciar el juego...
                </div>
            )}

            {roomState.players.length < 5 && (
                <div className="mt-2 text-red-600">
                    Se necesitan al menos 5 jugadores para comenzar
                </div>
            )}
        </div>
    );
};

export default Lobby;
