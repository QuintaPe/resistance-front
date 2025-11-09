import React from "react";

interface VoteButtonsProps {
    onVote: (vote: "approve" | "reject") => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ onVote }) => {
    return (
        <div className="flex gap-4 mt-2">
            <button
                onClick={() => onVote("approve")}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Aprobar
            </button>
            <button
                onClick={() => onVote("reject")}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Rechazar
            </button>
        </div>
    );
};

export default VoteButtons;
