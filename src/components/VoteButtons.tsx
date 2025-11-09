import React from "react";

interface VoteButtonsProps {
    onVote: (vote: "approve" | "reject") => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ onVote }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <button
                onClick={() => onVote("approve")}
                className="btn-success flex-1 flex items-center justify-center gap-2 text-base sm:text-lg"
            >
                <span className="text-xl sm:text-2xl">✓</span>
                <span>Aprobar</span>
            </button>
            <button
                onClick={() => onVote("reject")}
                className="btn-danger flex-1 flex items-center justify-center gap-2 text-base sm:text-lg"
            >
                <span className="text-xl sm:text-2xl">✗</span>
                <span>Rechazar</span>
            </button>
        </div>
    );
};

export default VoteButtons;
