import React from "react";

interface MissionActionProps {
    canFail?: boolean; // true si el jugador es espía
    onAction: (action: "success" | "fail") => void;
}

const MissionAction: React.FC<MissionActionProps> = ({ canFail = false, onAction }) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <p>Elige tu acción para la misión:</p>
            <div className="flex gap-4">
                <button
                    onClick={() => onAction("success")}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Éxito
                </button>
                {canFail && (
                    <button
                        onClick={() => onAction("fail")}
                        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Fallo
                    </button>
                )}
            </div>
            {!canFail && <p className="text-gray-600">Como miembro de la resistencia solo puedes elegir Éxito</p>}
        </div>
    );
};

export default MissionAction;
