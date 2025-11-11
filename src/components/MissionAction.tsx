import React, { useState } from "react";
import { Check, X, Clock, Info } from "lucide-react";

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
                <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="inline-block mb-4">
                        <div className="relative">
                            <div className={`absolute inset-0 rounded-2xl blur-lg opacity-50 animate-pulse-glow ${selectedAction === "success" ? "bg-green-500/50" : "bg-red-500/50"
                                }`}></div>
                            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${selectedAction === "success"
                                    ? "bg-linear-to-br from-green-500 to-green-600"
                                    : "bg-linear-to-br from-red-500 to-red-600"
                                }`}>
                                {selectedAction === "success" ? (
                                    <Check className="w-8 h-8 text-white" />
                                ) : (
                                    <X className="w-8 h-8 text-white" />
                                )}
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">¡Acción Enviada!</h3>
                    <p className="text-slate-300 mb-4">
                        Has elegido: <span className={`font-bold ${selectedAction === "success" ? "text-green-400" : "text-red-400"}`}>
                            {selectedAction === "success" ? "Contribuir al Éxito ✓" : "Sabotear Misión ✗"}
                        </span>
                    </p>

                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50">
                        <Clock className="w-6 h-6 animate-pulse text-slate-400" />
                        <p className="text-slate-400 text-sm sm:text-base font-medium">
                            Esperando a los demás miembros del equipo...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-5 sm:space-y-6 w-full max-w-md px-2 sm:px-0">
                <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Botón Éxito */}
                    <button
                        onClick={() => handleActionClick("success")}
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
                            onClick={() => handleActionClick("fail")}
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
                                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-60 animate-pulse-glow ${selectedAction === "success" ? "bg-green-500/50" : "bg-red-500/50"
                                    }`}></div>
                                <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${selectedAction === "success"
                                        ? "bg-linear-to-br from-green-500 to-green-600"
                                        : "bg-linear-to-br from-red-500 to-red-600"
                                    }`}>
                                    <span className="text-4xl">
                                        {selectedAction === "success" ? "✓" : "✗"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contenido */}
                        <h3 className="text-2xl font-black text-white text-center mb-3">
                            Confirmar Acción
                        </h3>
                        <p className="text-slate-300 text-center mb-6">
                            {selectedAction === "success" ? (
                                <>
                                    ¿Confirmas que quieres{" "}
                                    <span className="font-bold text-green-400">CONTRIBUIR AL ÉXITO</span>
                                    {" "}de esta misión?
                                </>
                            ) : (
                                <>
                                    ¿Confirmas que quieres{" "}
                                    <span className="font-bold text-red-400">SABOTEAR LA MISIÓN</span>?
                                    <br />
                                    <span className="text-sm text-red-300 mt-2 inline-block">
                                        Esta acción causará el fallo de la misión.
                                    </span>
                                </>
                            )}
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
                                <div className={`absolute inset-0 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-200 ${selectedAction === "success"
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

export default MissionAction;
