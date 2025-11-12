import React, { useState, useEffect, useMemo } from "react";
import { Target } from "lucide-react";

interface MissionSuspenseProps {
    missionNumber: number;
    result: {
        passed: boolean;
        fails: number;
        team: string[];
    };
    onComplete: () => void;
}

// Componente para tarjeta individual
const IndividualCard: React.FC<{ isSuccess: boolean; cardNumber: number; total: number; isExiting: boolean }> = ({ isSuccess, cardNumber, total, isExiting }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsFlipped(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            {/* Contador de votos */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {Array.from({ length: total }).map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx < cardNumber ? 'bg-purple-400 scale-100' :
                                idx === cardNumber ? 'bg-purple-400 animate-pulse scale-125' :
                                    'bg-slate-600 scale-90'
                            }`}
                    />
                ))}
            </div>

            {/* Tarjeta con animaciones */}
            <div
                className={`relative w-full max-w-xs transition-all duration-500 ${isExiting
                        ? 'opacity-0 -translate-x-full rotate-[-10deg] scale-75'
                        : 'opacity-100 translate-x-0 rotate-0 scale-100 animate-slideInRight'
                    }`}
                style={{
                    perspective: '1000px'
                }}
            >
                <div
                    className="relative w-full transition-all duration-1000 ease-out"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* Frente */}
                    <div
                        className="w-full"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 rounded-xl opacity-50 blur-2xl bg-slate-500/30 animate-pulse"></div>

                            <div className="relative backdrop-blur-xl rounded-xl shadow-2xl border-2 bg-slate-800/40 border-slate-700/50 p-8 transition-transform duration-300 group-hover:scale-105">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-linear-to-br from-slate-600 to-slate-700 animate-pulse">
                                        <span className="text-4xl text-slate-400">?</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-slate-400 uppercase tracking-wide font-semibold">
                                            Voto {cardNumber + 1}
                                        </p>
                                        <div className="flex justify-center gap-1 mt-2">
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reverso */}
                    <div
                        className="absolute inset-0 w-full"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        <div className="relative group">
                            <div className={`absolute inset-0 rounded-xl blur-2xl transition-opacity duration-500 ${isSuccess ? 'bg-green-500/40 opacity-60' : 'bg-red-500/40 opacity-60'
                                } animate-pulse`}></div>

                            <div className={`relative backdrop-blur-xl rounded-xl shadow-2xl border-2 transition-all duration-300 ${isSuccess
                                    ? 'bg-green-500/15 border-green-500/40'
                                    : 'bg-red-500/15 border-red-500/40'
                                }`}>
                                <div className="p-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className={`w-20 h-20 rounded-lg flex items-center justify-center transition-transform duration-500 animate-scaleIn ${isSuccess
                                                ? 'bg-linear-to-br from-green-500 to-green-600'
                                                : 'bg-linear-to-br from-red-500 to-red-600'
                                            }`}>
                                            <span className="text-5xl text-white font-bold animate-bounce">
                                                {isSuccess ? '✓' : '✗'}
                                            </span>
                                        </div>
                                        <div className="text-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
                                            <p className={`text-2xl font-black ${isSuccess ? 'text-green-300' : 'text-red-300'
                                                }`}>
                                                {isSuccess ? 'Éxito' : 'Sabotaje'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MissionSuspense: React.FC<MissionSuspenseProps> = ({ missionNumber, result, onComplete }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showFinalResult, setShowFinalResult] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // Generar array de votos individuales y barajarlos
    const individualVotes = useMemo(() => {
        const votes: boolean[] = [];
        const teamSize = result.team.length;
        const successes = teamSize - result.fails;

        // Crear array con éxitos y fallos
        for (let i = 0; i < successes; i++) {
            votes.push(true); // éxito
        }
        for (let i = 0; i < result.fails; i++) {
            votes.push(false); // fallo
        }

        // Barajar aleatoriamente
        return votes.sort(() => Math.random() - 0.5);
    }, [result.team.length, result.fails]);

    useEffect(() => {
        if (currentCardIndex < individualVotes.length) {
            // Mostrar cada tarjeta por 3.0 segundos (0.6s entrada + 1.2s volteo + 0.7s mostrar + 0.5s salida)
            const exitTimer = setTimeout(() => {
                setIsExiting(true);
            }, 3000);

            const nextTimer = setTimeout(() => {
                setCurrentCardIndex(prev => prev + 1);
                setIsExiting(false);
            }, 3500);

            return () => {
                clearTimeout(exitTimer);
                clearTimeout(nextTimer);
            };
        } else if (!showFinalResult) {
            // Después de todas las tarjetas, mostrar resultado final
            const timer = setTimeout(() => {
                setShowFinalResult(true);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            // Cerrar después del resultado final
            const timer = setTimeout(() => {
                onComplete();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentCardIndex, individualVotes.length, showFinalResult, onComplete]);

    // Mostrar resultado final
    if (showFinalResult) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

                <div className="relative w-full max-w-sm">
                    <div className="relative group">
                        <div className={`absolute inset-0 rounded-xl opacity-50 blur-2xl ${result.passed ? 'bg-green-500/30' : 'bg-red-500/30'
                            }`}></div>

                        <div className={`relative backdrop-blur-xl rounded-xl shadow-2xl border-2 animate-scaleIn ${result.passed
                                ? 'bg-green-500/15 border-green-500/40'
                                : 'bg-red-500/15 border-red-500/40'
                            }`}>
                            <div className="p-6 border-b border-white/10">
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${result.passed
                                            ? 'bg-linear-to-br from-green-500 to-green-600'
                                            : 'bg-linear-to-br from-red-500 to-red-600'
                                        }`}>
                                        <span className="text-4xl text-white font-bold">
                                            {result.passed ? '✓' : '✗'}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                                            Misión {missionNumber}
                                        </p>
                                        <h2 className={`text-3xl font-black ${result.passed ? 'text-green-300' : 'text-red-300'
                                            }`}>
                                            {result.passed ? 'Éxito' : 'Fracaso'}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {result.fails > 0 && (
                                <div className="p-6">
                                    <div className="backdrop-blur-sm rounded-lg p-4 border bg-red-500/20 border-red-500/40 text-center">
                                        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">
                                            Total Sabotajes
                                        </p>
                                        <p className="text-4xl font-black text-red-300">
                                            {result.fails}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar tarjetas individuales
    if (currentCardIndex < individualVotes.length) {
        return (
            <IndividualCard
                key={currentCardIndex}
                isSuccess={individualVotes[currentCardIndex]}
                cardNumber={currentCardIndex}
                total={individualVotes.length}
                isExiting={isExiting}
            />
        );
    }

    return null;
};

export default MissionSuspense;

