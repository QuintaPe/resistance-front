import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import type { Player } from "../types";
import VotingStatus from "./VotingStatus";

interface VoteButtonsProps {
    onVote: (vote: "approve" | "reject") => void;
    players?: Player[];
    votedPlayers?: string[];
    currentPlayerId?: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
    onVote,
    players,
    votedPlayers,
    currentPlayerId
}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedVote, setSelectedVote] = useState<"approve" | "reject" | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    const handleVoteClick = (vote: "approve" | "reject") => {
        setSelectedVote(vote);
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (selectedVote) {
            onVote(selectedVote);
            setHasVoted(true);
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedVote(null);
    };

    // Si ya votó, mostrar estado de votación
    if (hasVoted) {
        return (
            <div className="w-full space-y-5 animate-fadeIn">
                {/* Indicador de voto confirmado */}
                <div className="relative group">
                    {/* Efecto de brillo sutil */}
                    <div className={`absolute inset-0 rounded-lg opacity-40 blur-xl ${selectedVote === "approve"
                        ? "bg-green-500/50"
                        : "bg-red-500/50"
                        }`}></div>

                    {/* Botón confirmado */}
                    <div className={`relative backdrop-blur-sm rounded-lg p-3.5 border-2 ${selectedVote === "approve"
                        ? "bg-green-500/15 border-green-500/50"
                        : "bg-red-500/15 border-red-500/50"
                        }`}>
                        <div className="flex items-center justify-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedVote === "approve"
                                ? "bg-linear-to-br from-green-500 to-green-600"
                                : "bg-linear-to-br from-red-500 to-red-600"
                                }`}>
                                <span className="text-white text-lg font-bold">
                                    {selectedVote === "approve" ? "✓" : "✗"}
                                </span>
                            </div>
                            <div className="flex-1 text-center">
                                <p className={`font-bold text-sm uppercase tracking-wide ${selectedVote === "approve" ? "text-green-300" : "text-red-300"
                                    }`}>
                                    Has votado: {selectedVote === "approve" ? "Aprobar" : "Rechazar"}
                                </p>
                            </div>
                            <Check className={`w-5 h-5 ${selectedVote === "approve" ? "text-green-400" : "text-red-400"
                                }`} />
                        </div>
                    </div>
                </div>

                {/* Estado de votación de todos los jugadores */}
                {players && votedPlayers && currentPlayerId && (
                    <VotingStatus
                        players={players}
                        votedPlayers={votedPlayers}
                        currentPlayerId={currentPlayerId}
                    />
                )}
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-3 w-full">
                {/* Botón Aprobar */}
                <button
                    onClick={() => handleVoteClick("approve")}
                    className="relative group"
                >
                    {/* Efecto de hover */}
                    <div className="absolute inset-0 bg-linear-to-r from-green-500/0 via-green-500/20 to-green-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Contenedor principal */}
                    <div className="relative backdrop-blur-sm bg-green-500/10 border-2 border-green-500/40 rounded-lg p-3 sm:p-3.5 group-hover:border-green-400/60 group-hover:bg-green-500/20 transition-all duration-200">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <span className="text-white text-lg sm:text-xl font-bold">✓</span>
                            </div>
                            <span className="text-green-300 font-bold text-sm sm:text-base uppercase tracking-wide">Aprobar</span>
                        </div>
                    </div>
                </button>

                {/* Botón Rechazar */}
                <button
                    onClick={() => handleVoteClick("reject")}
                    className="relative group"
                >
                    {/* Efecto de hover */}
                    <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-red-500/20 to-red-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Contenedor principal */}
                    <div className="relative backdrop-blur-sm bg-red-500/10 border-2 border-red-500/40 rounded-lg p-3 sm:p-3.5 group-hover:border-red-400/60 group-hover:bg-red-500/20 transition-all duration-200">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <span className="text-white text-lg sm:text-xl font-bold">✗</span>
                            </div>
                            <span className="text-red-300 font-bold text-sm sm:text-base uppercase tracking-wide">Rechazar</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Modal de confirmación */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={handleCancel}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

                    {/* Modal */}
                    <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className={`absolute inset-0 rounded-xl opacity-50 blur-2xl ${selectedVote === "approve" ? "bg-green-500/30" : "bg-red-500/30"
                            }`}></div>

                        <div className={`relative backdrop-blur-xl rounded-xl shadow-2xl border-2 ${selectedVote === "approve"
                            ? "bg-green-500/15 border-green-500/40"
                            : "bg-red-500/15 border-red-500/40"
                            }`}>
                            {/* Header */}
                            <div className="p-5 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedVote === "approve"
                                        ? "bg-linear-to-br from-green-500 to-green-600"
                                        : "bg-linear-to-br from-red-500 to-red-600"
                                        }`}>
                                        <span className="text-2xl text-white font-bold">
                                            {selectedVote === "approve" ? "✓" : "✗"}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                                            Confirmar Voto
                                        </p>
                                        <h2 className={`text-xl font-bold ${selectedVote === "approve" ? "text-green-300" : "text-red-300"
                                            }`}>
                                            {selectedVote === "approve" ? "Aprobar Equipo" : "Rechazar Equipo"}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <p className="text-slate-300 text-sm text-center mb-4">
                                    ¿Estás seguro de que quieres {selectedVote === "approve" ? "aprobar" : "rechazar"} este equipo?
                                </p>

                                {/* Botones */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-white rounded-lg font-semibold text-sm transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="relative flex-1 group overflow-hidden rounded-lg"
                                    >
                                        <div className={`absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity ${selectedVote === "approve"
                                            ? "bg-linear-to-r from-green-600 to-emerald-600"
                                            : "bg-linear-to-r from-red-600 to-rose-600"
                                            }`}></div>
                                        <div className="relative px-4 py-2.5 text-white font-semibold text-sm">
                                            Confirmar
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default VoteButtons;
