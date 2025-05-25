'use client'

import React from 'react';

interface PalabraButtonProps {
    palabra: string;
    tipo: "origen" | "traduccion";
    isSelected: boolean;
    onClick: (palabra: string, tipo: "origen" | "traduccion") => void;
}

const PalabraButton: React.FC<PalabraButtonProps> = ({ palabra, tipo, isSelected, onClick }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95";

    const typeClasses = tipo === "origen"
        ? "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-800 border border-blue-200"
        : "bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-800 border border-green-200";

    const selectedClasses = isSelected
        ? (tipo === "origen"
            ? "ring-2 ring-blue-500 bg-blue-200 shadow-lg"
            : "ring-2 ring-green-500 bg-green-200 shadow-lg")
        : "hover:shadow-md";

    return (
        <button
            onClick={() => onClick(palabra, tipo)}
            className={`${baseClasses} ${typeClasses} ${selectedClasses}`}
        >
            {palabra}
        </button>
    );
};

export default PalabraButton;