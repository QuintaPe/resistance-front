import React from "react";
import type { Player } from "../types";

interface PlayerListProps {
    players: Player[];
    leaderId: string;
    currentPlayerId: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, leaderId, currentPlayerId }) => {
    return (
        <div className="flex flex-col gap-2 border p-4 rounded w-72">
            <h3 className="font-semibold">Jugadores ({players.length})</h3>
            {players.map((p) => {
                const isLeader = p.id === leaderId;
                const isYou = p.id === currentPlayerId;
                return (
                    <div
                        key={p.id}
                        className={`p-1 rounded ${isLeader ? "bg-yellow-200 font-bold" : "bg-gray-100"
                            }`}
                    >
                        {p.name} {isYou ? "(Tú)" : ""} {isLeader && "👑"}
                    </div>
                );
            })}
        </div>
    );
};

export default PlayerList;
