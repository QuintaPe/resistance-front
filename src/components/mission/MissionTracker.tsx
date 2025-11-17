import React from "react";
import type { MissionResult } from "../../types";

interface MissionTrackerProps {
    total: number;
    results: MissionResult[];
    failsRequired?: number[];
    onMissionClick?: (missionIndex: number, result: MissionResult) => void;
}

const MissionTracker: React.FC<MissionTrackerProps> = ({ total, results, failsRequired, onMissionClick }) => {
    return (
        <div className="flex gap-3 sm:gap-4">
            {Array.from({ length: total }).map((_, idx) => {
                const result = results[idx];
                const isCompleted = idx < results.length;
                const requiresTwoFails = failsRequired && failsRequired[idx] === 2;

                return (
                    <div
                        key={idx}
                        className="relative group"
                        title={`Misión ${idx + 1}${isCompleted ? (result.passed ? ' - Éxito' : ` - Fallo (${result.fails})`) : ''}`}
                    >
                        {/* Efecto de brillo sutil */}
                        {isCompleted && (
                            <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${result.passed
                                ? "bg-linear-to-r from-green-500/0 via-green-500/20 to-green-500/0"
                                : "bg-linear-to-r from-red-500/0 via-red-500/20 to-red-500/0"
                                }`}></div>
                        )}

                        {/* Card de misión */}
                        <div
                            className={`
                                relative backdrop-blur-sm rounded-lg p-3 sm:p-4 border transition-all duration-300
                                ${isCompleted
                                    ? `cursor-pointer ${result.passed
                                        ? "bg-green-500/15 border-green-500/50 hover:border-green-400 hover:bg-green-500/20 hover:scale-105"
                                        : "bg-red-500/15 border-red-500/50 hover:border-red-400 hover:bg-red-500/20 hover:scale-105"}`
                                    : "bg-slate-800/60 border-slate-700/50 opacity-50"
                                }
                            `}
                            onClick={() => isCompleted && onMissionClick && onMissionClick(idx, result)}
                        >
                            <div className="flex flex-col items-center gap-1 sm:gap-1.5">
                                {/* Icono/Número */}
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center ${isCompleted
                                    ? result.passed
                                        ? "bg-linear-to-br from-green-500 to-green-600"
                                        : "bg-linear-to-br from-red-500 to-red-600"
                                    : "bg-slate-700/70"
                                    }`}>
                                    {isCompleted ? (
                                        <span className="text-white text-lg sm:text-2xl font-black">
                                            {result.passed ? "✓" : "✗"}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-sm sm:text-base font-bold">{idx + 1}</span>
                                    )}
                                </div>

                                {/* Etiqueta */}
                                <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${isCompleted
                                    ? result.passed ? "text-green-300" : "text-red-300"
                                    : "text-slate-500"
                                    }`}>
                                    <span className="sm:hidden">M{idx + 1}</span>
                                    <span className="hidden sm:inline">Misión {idx + 1}</span>
                                </span>
                            </div>

                            {/* Badge para el número de fallos */}
                            {isCompleted && !result.passed && result.fails > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-linear-to-br from-amber-500 to-orange-600 border-2 border-slate-900 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                                    {result.fails}
                                </div>
                            )}

                            {/* Badge para misiones que requieren 2 fracasos */}
                            {!isCompleted && requiresTwoFails && (
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-linear-to-br from-yellow-500 to-amber-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                                    2
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MissionTracker;

