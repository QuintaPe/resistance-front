import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";

const Home: React.FC = () => {
    const { createRoom, joinRoom } = useSocket();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");

    // Crear sala
    const handleCreateRoom = () => {
        if (!name.trim()) return setError("Ingresa tu nombre");
        createRoom(name, (newRoomCode) => {
            navigate(`/lobby/${newRoomCode}`);
        });
    };

    // Unirse a sala existente
    const handleJoinRoom = () => {
        if (!name.trim() || !roomCode.trim()) return setError("Completa todos los campos");
        joinRoom(roomCode.toUpperCase(), name, (ok, err) => {
            if (ok) navigate(`/lobby/${roomCode.toUpperCase()}`);
            else setError(err || "Error al unirse a la sala");
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <h1 className="text-3xl font-bold">The Resistance</h1>

            <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded w-64 text-center"
            />

            {error && <div className="text-red-600">{error}</div>}

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleCreateRoom}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Crear Sala
                </button>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Código de sala"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="p-2 border rounded w-32 text-center"
                    />
                    <button
                        onClick={handleJoinRoom}
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    >
                        Unirse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
