import React, { useState } from "react";

interface VoteButtonsProps {
    onVote: (vote: "approve" | "reject") => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ onVote }) => {
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

    // Si ya votó, mostrar mensaje de espera
    if (hasVoted) {
        return (
            <div className="w-full max-w-md animate-fadeIn">
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                    
                    <div className="inline-block mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 animate-pulse-glow"></div>
                            <div className="relative w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                                <span className="text-4xl">✓</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">¡Voto Enviado!</h3>
                    <p className="text-slate-300 mb-4">
                        Has votado: <span className={`font-bold ${selectedVote === "approve" ? "text-green-400" : "text-red-400"}`}>
                            {selectedVote === "approve" ? "Aprobar ✓" : "Rechazar ✗"}
                        </span>
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50">
                        <span className="text-2xl animate-pulse">⏳</span>
                        <p className="text-slate-400 text-sm sm:text-base font-medium">
                            Esperando a los demás jugadores...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Botón Aprobar */}
                <button
                    onClick={() => handleVoteClick("approve")}
                    className="relative flex-1 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-green-600 via-green-500 to-emerald-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <div className="relative px-6 py-4 flex items-center justify-center gap-3 text-white font-bold text-lg sm:text-xl">
                        <span className="text-2xl sm:text-3xl group-hover:scale-125 transition-transform duration-200">✓</span>
                        <span>Aprobar</span>
                    </div>
                </button>

                {/* Botón Rechazar */}
                <button
                    onClick={() => handleVoteClick("reject")}
                    className="relative flex-1 group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-red-600 via-red-500 to-rose-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-red-400/0 via-white/20 to-red-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <div className="relative px-6 py-4 flex items-center justify-center gap-3 text-white font-bold text-lg sm:text-xl">
                        <span className="text-2xl sm:text-3xl group-hover:scale-125 transition-transform duration-200">✗</span>
                        <span>Rechazar</span>
                    </div>
                </button>
            </div>

            {/* Modal de confirmación */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCancel}></div>
                    
                    {/* Modal */}
                    <div className="relative w-full max-w-md backdrop-blur-xl bg-slate-900/95 rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-fadeIn">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                        
                        {/* Icono */}
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-60 animate-pulse-glow ${
                                    selectedVote === "approve" ? "bg-green-500/50" : "bg-red-500/50"
                                }`}></div>
                                <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                                    selectedVote === "approve" 
                                        ? "bg-linear-to-br from-green-500 to-green-600" 
                                        : "bg-linear-to-br from-red-500 to-red-600"
                                }`}>
                                    <span className="text-4xl">
                                        {selectedVote === "approve" ? "✓" : "✗"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contenido */}
                        <h3 className="text-2xl font-black text-white text-center mb-3">
                            Confirmar Voto
                        </h3>
                        <p className="text-slate-300 text-center mb-6">
                            ¿Estás seguro de que quieres{" "}
                            <span className={`font-bold ${selectedVote === "approve" ? "text-green-400" : "text-red-400"}`}>
                                {selectedVote === "approve" ? "APROBAR" : "RECHAZAR"}
                            </span>
                            {" "}este equipo?
                        </p>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="relative flex-1 group overflow-hidden"
                            >
                                <div className={`absolute inset-0 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200 ${
                                    selectedVote === "approve" 
                                        ? "bg-linear-to-r from-green-600 to-emerald-600" 
                                        : "bg-linear-to-r from-red-600 to-rose-600"
                                }`}></div>
                                <div className="relative px-4 py-3 text-white font-semibold">
                                    Confirmar
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VoteButtons;
