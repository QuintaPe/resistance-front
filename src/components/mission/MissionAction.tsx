import React, { useState } from "react";
import { createPortal } from "react-dom";

interface MissionActionProps {
    canFail?: boolean; // true si el jugador es espía
    onAction: (action: "success" | "fail") => void;
}

const MissionAction: React.FC<MissionActionProps> = ({ canFail = false, onAction }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState<"success" | "fail" | null>(null);
    const [hasActed, setHasActed] = useState(false);

    const handleActionClick = (action: "success" | "fail") => {
        setSelectedAction(action);
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (selectedAction) {
            onAction(selectedAction);
            setHasActed(true);
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedAction(null);
    };

    // Si ya actuó, mostrar mensaje de espera
    if (hasActed) {
        return (
            <div className="w-full max-w-md animate-fadeIn">
                <p className="text-slate-300 text-center">
                    Has elegido: <span className={`font-bold ${selectedAction === "success" ? "text-green-400" : "text-red-400"}`}>
                        {selectedAction === "success" ? "Contribuir al Éxito ✓" : "Sabotear Misión ✗"}
                    </span>
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-md space-y-4">
                <div className={`grid gap-3 ${canFail ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Botón Éxito */}
                    <button
                        onClick={() => handleActionClick("success")}
                        className="relative group"
                    >
                        {/* Efecto de hover */}
                        <div className="absolute inset-0 bg-linear-to-r from-green-500/0 via-green-500/20 to-green-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Contenedor principal */}
                        <div className="relative backdrop-blur-sm bg-green-500/10 border-2 border-green-500/40 rounded-lg p-3 sm:p-3.5 group-hover:border-green-400/60 group-hover:bg-green-500/20 transition-all duration-200">
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <span className="text-white text-xl sm:text-2xl font-bold">✓</span>
                                </div>
                                <span className="text-green-300 font-bold text-xs sm:text-sm uppercase tracking-wide text-center">
                                    {canFail ? "Éxito" : "Contribuir al Éxito"}
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* Botón Sabotaje (solo para espías) */}
                    {canFail && (
                        <button
                            onClick={() => handleActionClick("fail")}
                            className="relative group"
                        >
                            {/* Efecto de hover */}
                            <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-red-500/20 to-red-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Contenedor principal */}
                            <div className="relative backdrop-blur-sm bg-red-500/10 border-2 border-red-500/40 rounded-lg p-3 sm:p-3.5 group-hover:border-red-400/60 group-hover:bg-red-500/20 transition-all duration-200">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <span className="text-white text-xl sm:text-2xl font-bold">✗</span>
                                    </div>
                                    <span className="text-red-300 font-bold text-xs sm:text-sm uppercase tracking-wide text-center">Sabotear</span>
                                </div>
                            </div>
                        </button>
                    )}
                </div>

                {/* Info para resistencia */}
                {!canFail && (
                    <div className="relative backdrop-blur-sm bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-blue-300 text-xs sm:text-sm">
                            <span className="text-base">ℹ️</span>
                            <p className="font-medium">
                                Como resistencia solo puedes contribuir al éxito
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de confirmación */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={handleCancel}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

                    {/* Modal */}
                    <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className={`absolute inset-0 rounded-xl opacity-50 blur-2xl ${selectedAction === "success" ? "bg-green-500/30" : "bg-red-500/30"
                            }`}></div>

                        <div className={`relative backdrop-blur-xl rounded-xl shadow-2xl border-2 ${selectedAction === "success"
                            ? "bg-green-500/15 border-green-500/40"
                            : "bg-red-500/15 border-red-500/40"
                            }`}>
                            {/* Header */}
                            <div className="p-5 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedAction === "success"
                                        ? "bg-linear-to-br from-green-500 to-green-600"
                                        : "bg-linear-to-br from-red-500 to-red-600"
                                        }`}>
                                        <span className="text-2xl text-white font-bold">
                                            {selectedAction === "success" ? "✓" : "✗"}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                                            Confirmar
                                        </p>
                                        <h2 className={`text-xl font-bold ${selectedAction === "success" ? "text-green-300" : "text-red-300"
                                            }`}>
                                            {selectedAction === "success" ? "Contribuir al Éxito" : "Sabotear Misión"}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <p className="text-slate-300 text-sm text-center mb-4">
                                    {selectedAction === "success" ? (
                                        <>¿Confirmas que quieres contribuir al éxito de esta misión?</>
                                    ) : (
                                        <>
                                            ¿Confirmas que quieres sabotear la misión?
                                            <span className="block text-xs text-red-300 mt-2">
                                                Esta acción causará el fallo de la misión.
                                            </span>
                                        </>
                                    )}
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
                                        <div className={`absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity ${selectedAction === "success"
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

export default MissionAction;

