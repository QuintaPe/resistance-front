import React from "react";

interface VoteButtonsProps {
    onVote: (vote: "approve" | "reject") => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ onVote }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Botón Aprobar */}
            <button
                onClick={() => onVote("approve")}
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
                onClick={() => onVote("reject")}
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
    );
};

export default VoteButtons;
