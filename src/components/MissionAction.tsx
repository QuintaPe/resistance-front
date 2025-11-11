import React from "react";

interface MissionActionProps {
    canFail?: boolean; // true si el jugador es espía
    onAction: (action: "success" | "fail") => void;
}

const MissionAction: React.FC<MissionActionProps> = ({ canFail = false, onAction }) => {
    return (
        <div className="space-y-5 sm:space-y-6 w-full max-w-md px-2 sm:px-0">
            <div className="flex flex-col gap-3 sm:gap-4">
                {/* Botón Éxito */}
                <button
                    onClick={() => onAction("success")}
                    className="relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-green-600 via-green-500 to-emerald-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="absolute inset-0 bg-linear-to-r from-green-400/0 via-white/20 to-green-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <div className="relative px-6 py-4 flex items-center justify-center gap-3 text-white font-bold text-lg sm:text-xl">
                        <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">✓</span>
                        <span>Contribuir al Éxito</span>
                    </div>
                </button>

                {/* Botón Sabotaje (solo para espías) */}
                {canFail && (
                    <button
                        onClick={() => onAction("fail")}
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-red-600 via-red-500 to-rose-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-red-400/0 via-white/20 to-red-400/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <div className="relative px-6 py-4 flex items-center justify-center gap-3 text-white font-bold text-lg sm:text-xl">
                            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">✗</span>
                            <span>Sabotear Misión</span>
                        </div>
                    </button>
                )}
            </div>

            {/* Info para resistencia */}
            {!canFail && (
                <div className="relative backdrop-blur-sm bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-300 text-sm sm:text-base">
                        <span className="text-lg">ℹ️</span>
                        <p className="font-medium">
                            Como miembro de la resistencia solo puedes contribuir al éxito
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionAction;
