import React from "react";
import type { MissionResult } from "../types";

interface MissionTrackerProps {
    total: number;
    results: MissionResult[];
}

const MissionTracker: React.FC<MissionTrackerProps> = ({ total, results }) => {
    return (
        <div className="flex gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: total }).map((_, idx) => {
                const result = results[idx];
                const isCompleted = idx < results.length;

                let bgColor = "bg-slate-700/50 border-slate-600/50";
                let icon = "";
                let tooltip = `Misión ${idx + 1}`;
                let glowClass = "";
                let hoverClass = "";

                if (isCompleted) {
                    if (result.passed) {
                        bgColor = "bg-linear-to-br from-green-500 to-green-600 border-green-400/50";
                        icon = "✓";
                        tooltip = `Misión ${idx + 1}: Éxito`;
                        glowClass = "";
                        hoverClass = "hover:scale-110";
                    } else {
                        bgColor = "bg-linear-to-br from-red-500 to-red-600 border-red-400/50";
                        icon = "✗";
                        tooltip = `Misión ${idx + 1}: Fallo (${result.fails} fallo${result.fails > 1 ? 's' : ''})`;
                        glowClass = "";
                        hoverClass = "hover:scale-110";
                    }
                } else {
                    tooltip = `Misión ${idx + 1}: Pendiente`;
                    hoverClass = "hover:scale-105";
                }

                return (
                    <div
                        key={idx}
                        className={`
                            relative group w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl border-2 
                            flex items-center justify-center font-black text-white text-xl sm:text-2xl md:text-3xl
                            transition-all duration-300 shrink-0 cursor-pointer
                            ${bgColor} ${glowClass} ${hoverClass}
                            ${!isCompleted ? "opacity-30 hover:opacity-50" : ""}
                        `}
                        title={tooltip}
                    >
                        {/* Efecto de brillo en hover */}
                        {isCompleted && (
                            <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}

                        {/* Contenido */}
                        <div className="relative">
                            {isCompleted ? (
                                <span className="drop-shadow-lg">{icon}</span>
                            ) : (
                                <span className="text-sm sm:text-base text-slate-400 font-bold">{idx + 1}</span>
                            )}
                        </div>

                        {/* Badge pequeño para el número de fallos */}
                        {isCompleted && !result.passed && result.fails > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 border-2 border-slate-900 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold">
                                {result.fails}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MissionTracker;
