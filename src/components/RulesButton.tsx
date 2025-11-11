import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const RulesButton: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setShowModal(false);
        document.body.style.overflow = 'unset';
    };

    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showModal) {
                handleCloseModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showModal]);

    const modalContent = showModal ? (
        <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{
                zIndex: 99999,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={handleCloseModal}
            />

            {/* Modal content */}
            <div
                className="relative w-full max-w-6xl h-[90vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-slate-800 border-b border-slate-700 shrink-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-lg sm:text-2xl">📖</span>
                        </div>
                        <h2 className="text-lg sm:text-2xl font-bold text-white">Reglas del Juego</h2>
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-700/50 hover:bg-red-500/20 rounded-xl border border-slate-600 hover:border-red-500/50 transition-all duration-200 group"
                        aria-label="Cerrar"
                    >
                        <span className="text-slate-400 group-hover:text-red-400 text-xl sm:text-2xl font-bold leading-none">×</span>
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-hidden bg-white">
                    <iframe
                        src="/pdf/rules.pdf"
                        className="w-full h-full border-0"
                        title="Reglas del juego"
                    />
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            {/* Botón de reglas */}
            <button
                onClick={handleOpenModal}
                className="relative group overflow-hidden px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full hover:border-blue-500/50 hover:bg-slate-800/90 transition-all duration-200"
                aria-label="Ver reglas del juego"
            >
                <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                    <span className="text-base">📖</span>
                    <span>Reglas</span>
                </span>
            </button>

            {/* Renderizar modal en body */}
            {modalContent && createPortal(modalContent, document.body)}
        </>
    );
};

export default RulesButton;

