'use client'

import React from 'react';

interface PalabraButtonProps {
    palabra: string;
    tipo: "origen" | "traduccion";
    isSelected: boolean;
    onClick: (palabra: string, tipo: "origen" | "traduccion") => void;
}

const PalabraButton: React.FC<PalabraButtonProps> = ({ palabra, tipo, isSelected, onClick }) => {
    const bgColorClass = tipo === "origen" ? "bg-blue-100 hover:bg-blue-200" : "bg-green-100 hover:bg-green-200";
    const ringColorClass = tipo === "origen" ? "ring-blue-500" : "ring-green-500";

    return (
        <button
            onClick={() => onClick(palabra, tipo)}
            className={`${bgColorClass} px-3 py-2 rounded transition-colors ${isSelected ? `ring-2 ${ringColorClass}` : ""}`}
        >
            {palabra}
        </button>
    );
};

export default PalabraButton;