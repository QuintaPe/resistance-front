import React from "react";
import type { MissionResult } from "../types";

interface MissionTrackerProps {
    total: number;
    results: MissionResult[];
}

const MissionTracker: React.FC<MissionTrackerProps> = ({ total, results }) => {
    return (
        <div className="flex gap-3">
            {Array.from({ length: total }).map((_, idx) => {
                const result = results[idx];
                const isCompleted = idx < results.length;
                
                let bgColor = "bg-gray-200 border-gray-400";
                let icon = "";
                let tooltip = `Misión ${idx + 1}`;

                if (isCompleted) {
                    if (result.passed) {
                        bgColor = "bg-green-500 border-green-700";
                        icon = "✓";
                        tooltip = `Misión ${idx + 1}: Éxito`;
                    } else {
                        bgColor = "bg-red-500 border-red-700";
                        icon = "✗";
                        tooltip = `Misión ${idx + 1}: Fallo (${result.fails} fallo${result.fails > 1 ? 's' : ''})`;
                    }
                } else {
                    tooltip = `Misión ${idx + 1}: Pendiente`;
                }

                return (
                    <div
                        key={idx}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-white text-lg ${bgColor}`}
                        title={tooltip}
                    >
                        {icon}
                    </div>
                );
            })}
        </div>
    );
};

export default MissionTracker;
