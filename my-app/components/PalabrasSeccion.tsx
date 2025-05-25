'use client'

import React, { useState } from 'react';
import PalabraButton from './PalabraButton';
import PalabraDetalle from './PalabraDetalle';

interface PalabrasSeccionProps {
    palabrasSource: string[];
    sourceLanguage: string;
    targetLanguage: string;
}

const PalabrasSeccion: React.FC<PalabrasSeccionProps> = ({
    palabrasSource,
    sourceLanguage,
    targetLanguage
}) => {
    const [palabraSeleccionada, setPalabraSeleccionada] = useState<string | null>(null);
    const [tipoSeleccionada, setTipoSeleccionada] = useState<"origen" | "traduccion" | null>(null);

    // Function to clean words by removing punctuation marks
    const cleanWord = (word: string): string => {
        return word.replace(/[{}[\](),.!?;:"'`~@#$%^&*+=<>/\\|_-]/g, '').trim();
    };

    // Filter and clean words
    const cleanedWords = palabrasSource
        .map(word => cleanWord(word))
        .filter(word => word.length > 0);


    // Handler to select a word
    const handlePalabraClick = (palabra: string, tipo: "origen" | "traduccion") => {
        console.log('PalabrasSeccion - Word selected:', palabra);
        console.log('PalabrasSeccion - Languages:', sourceLanguage, '->', targetLanguage);
        setPalabraSeleccionada(palabra);
        setTipoSeleccionada(tipo);
    };

    // Close word detail
    const cerrarDetallePalabra = () => {
        setPalabraSeleccionada(null);
        setTipoSeleccionada(null);
    };

    // If there are no source words, don't show anything
    if (cleanedWords.length === 0) {
        return null;
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📚</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Word Analysis</h2>
                <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {cleanedWords.length} words
                </div>
            </div>

            {cleanedWords.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Original text
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {cleanedWords.map((palabra, index) => (
                            <PalabraButton
                                key={`source-${index}`}
                                palabra={palabra}
                                tipo="origen"
                                isSelected={palabraSeleccionada === palabra && tipoSeleccionada === "origen"}
                                onClick={handlePalabraClick}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Selected word detail */}
            {palabraSeleccionada && tipoSeleccionada && (
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                    <PalabraDetalle
                        palabra={palabraSeleccionada}
                        idiomaOrigen={sourceLanguage}
                        idiomaDestino={targetLanguage}
                        onClose={cerrarDetallePalabra}
                    />
                </div>
            )}
        </div>
    );
};

export default PalabrasSeccion;