import React from "react";
import { createPortal } from "react-dom";
import { X, Target, Users, AlertTriangle } from "lucide-react";
import type { MissionResult, Player } from "../types";

interface MissionDetailModalProps {
    missionNumber: number;
    result: MissionResult;
    players: Player[];
    onClose: () => void;
}

const MissionDetailModal: React.FC<MissionDetailModalProps> = ({
    missionNumber,
    result,
    players,
    onClose,
}) => {
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            {/* Modal */}
            <div
                className="relative w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Efecto de brillo */}
                <div
                    className={`absolute inset-0 rounded-xl opacity-50 blur-2xl ${
                        result.passed ? "bg-green-500/30" : "bg-red-500/30"
                    }`}
                ></div>

                <div
                    className={`relative backdrop-blur-xl rounded-xl shadow-2xl border-2 transition-all duration-300 ${
                        result.passed
                            ? "bg-green-500/15 border-green-500/40"
                            : "bg-red-500/15 border-red-500/40"
                    }`}
                >
                    {/* Header */}
                    <div className="p-5 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                        result.passed
                                            ? "bg-linear-to-br from-green-500 to-green-600"
                                            : "bg-linear-to-br from-red-500 to-red-600"
                                    }`}
                                >
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                                        Misión {missionNumber}
                                    </p>
                                    <h2
                                        className={`text-2xl font-bold ${
                                            result.passed ? "text-green-300" : "text-red-300"
                                        }`}
                                    >
                                        {result.passed ? "Éxito" : "Fracaso"}
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center hover:bg-slate-700/60 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-300" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                        {/* Equipo */}
                        <div className="relative group">
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-slate-500/0 via-slate-500/10 to-slate-500/0"></div>

                            <div className="relative backdrop-blur-sm rounded-lg p-3 border bg-slate-800/60 border-slate-700/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
                                        <Users className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                                            Equipo
                                        </p>
                                        <p className="text-sm font-bold text-blue-300">
                                            {result.team.length} agentes
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {result.team.map((pid) => {
                                        const player = players.find((p) => p.id === pid);
                                        return (
                                            <div
                                                key={pid}
                                                className="px-3 py-1.5 bg-slate-700/70 border border-slate-600/50 rounded text-xs font-medium text-white"
                                            >
                                                {player?.name || pid}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Fallos */}
                        {result.fails > 0 && (
                            <div className="relative group">
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-red-500/0 via-red-500/10 to-red-500/0"></div>

                                <div className="relative backdrop-blur-sm rounded-lg p-3 border bg-red-500/20 border-red-500/40">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded flex items-center justify-center bg-linear-to-br from-red-500 to-red-600">
                                            <AlertTriangle className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                                                Votos de Fallo
                                            </p>
                                            <p className="text-sm font-bold text-red-300">
                                                {result.fails} {result.fails === 1 ? "voto" : "votos"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resultado positivo sin fallos */}
                        {result.passed && result.fails === 0 && (
                            <div className="relative group">
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-green-500/0 via-green-500/10 to-green-500/0"></div>

                                <div className="relative backdrop-blur-sm rounded-lg p-3 border bg-green-500/20 border-green-500/40">
                                    <div className="flex items-center justify-center gap-2 text-green-300">
                                        <span className="text-2xl">✓</span>
                                        <p className="text-sm font-bold">Misión completada sin sabotajes</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={onClose}
                            className="w-full relative group overflow-hidden rounded-lg"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-slate-600 to-slate-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative px-4 py-2.5 text-white font-bold text-sm">
                                Cerrar
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MissionDetailModal;

