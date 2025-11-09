import React from "react";
import type { MissionResult } from "../types";

interface MissionTrackerProps {
    total: number;
    results: MissionResult[];
}

const MissionTracker: React.FC<MissionTrackerProps> = ({ total, results }) => {
    return (
        <div className="flex gap-2 sm:gap-3 md:gap-4">
            {Array.from({ length: total }).map((_, idx) => {
                const result = results[idx];
                const isCompleted = idx < results.length;
                
                let bgColor = "bg-slate-700/50 border-slate-600";
                let icon = "";
                let tooltip = `Misión ${idx + 1}`;
                let glowClass = "";

                if (isCompleted) {
                    if (result.passed) {
                        bgColor = "bg-gradient-to-br from-green-500 to-green-600 border-green-400";
                        icon = "✓";
                        tooltip = `Misión ${idx + 1}: Éxito`;
                        glowClass = "shadow-lg shadow-green-500/50";
                    } else {
                        bgColor = "bg-gradient-to-br from-red-500 to-red-600 border-red-400";
                        icon = "✗";
                        tooltip = `Misión ${idx + 1}: Fallo (${result.fails} fallo${result.fails > 1 ? 's' : ''})`;
                        glowClass = "shadow-lg shadow-red-500/50";
                    }
                } else {
                    tooltip = `Misión ${idx + 1}: Pendiente`;
                }

                return (
                    <div
                        key={idx}
                        className={`
                            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl border-2 
                            flex items-center justify-center font-bold text-white text-lg sm:text-xl md:text-2xl
                            transition-all duration-300 shrink-0
                            ${bgColor} ${glowClass}
                            ${!isCompleted ? "opacity-40" : ""}
                        `}
                        title={tooltip}
                    >
                        {isCompleted ? (
                            <span>{icon}</span>
                        ) : (
                            <span className="text-xs sm:text-sm text-slate-500">{idx + 1}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MissionTracker;
