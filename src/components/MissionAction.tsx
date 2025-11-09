import React from "react";

interface MissionActionProps {
    canFail?: boolean; // true si el jugador es espía
    onAction: (action: "success" | "fail") => void;
}

const MissionAction: React.FC<MissionActionProps> = ({ canFail = false, onAction }) => {
    return (
        <div className="space-y-4 sm:space-y-6 w-full max-w-md px-2 sm:px-0">
            <div className="flex flex-col gap-3 sm:gap-4">
                <button
                    onClick={() => onAction("success")}
                    className="btn-success text-base sm:text-lg py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3"
                >
                    <span className="text-2xl sm:text-3xl">✓</span>
                    <span>Contribuir al Éxito</span>
                </button>
                {canFail && (
                    <button
                        onClick={() => onAction("fail")}
                        className="btn-danger text-base sm:text-lg py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3"
                    >
                        <span className="text-2xl sm:text-3xl">✗</span>
                        <span>Sabotear Misión</span>
                    </button>
                )}
            </div>
            {!canFail && (
                <div className="card bg-blue-500/10 border-blue-500/30 text-center">
                    <p className="text-blue-300 text-xs sm:text-sm">
                        ℹ️ Como miembro de la resistencia solo puedes contribuir al éxito
                    </p>
                </div>
            )}
        </div>
    );
};

export default MissionAction;
