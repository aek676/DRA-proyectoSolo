'use client'

import React from 'react';

interface PalabraDetalleProps {
    palabra: string;
    onClose: () => void;
}

const PalabraDetalle: React.FC<PalabraDetalleProps> = ({
    palabra,
    onClose
}) => {
    return (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    Palabra: <span className="font-bold">{palabra}</span>
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 p-1"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-gray-700">
                        Esta es la información detallada para la palabra "{palabra}".
                    </p>
                </div>

                <div className="pt-2">
                    <h4 className="font-medium mb-1">Ejemplos de uso:</h4>
                    <p className="text-gray-600 italic">
                        No hay ejemplos disponibles.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PalabraDetalle;