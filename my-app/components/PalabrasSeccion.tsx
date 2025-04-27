'use client'

import React, { useState } from 'react';
import PalabraButton from './PalabraButton';
import PalabraDetalle from './PalabraDetalle';

interface PalabrasSeccionProps {
    palabrasSource: string[];
}

const PalabrasSeccion: React.FC<PalabrasSeccionProps> = ({
    palabrasSource,
}) => {
    const [palabraSeleccionada, setPalabraSeleccionada] = useState<string | null>(null);
    const [tipoSeleccionada, setTipoSeleccionada] = useState<"origen" | "traduccion" | null>(null);

    palabrasSource = ['Hola', 'mundo', 'esto', 'es', 'una', 'prueba'];

    // Manejador para seleccionar una palabra
    const handlePalabraClick = (palabra: string, tipo: "origen" | "traduccion") => {
        setPalabraSeleccionada(palabra);
        setTipoSeleccionada(tipo);
    };

    // Cerrar el detalle de la palabra
    const cerrarDetallePalabra = () => {
        setPalabraSeleccionada(null);
        setTipoSeleccionada(null);
    };

    // Si no hay palabras de origen, no mostramos nada
    if (palabrasSource.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 border-t pt-4">
            <h2 className="text-xl font-semibold mb-4">Palabras individuales</h2>

            {palabrasSource.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-md font-medium mb-2">Texto original:</h3>
                    <div className="flex flex-wrap gap-2">
                        {palabrasSource.map((palabra, index) => (
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

            {/* Detalle de la palabra seleccionada */}
            {palabraSeleccionada && tipoSeleccionada && (
                <PalabraDetalle
                    palabra={palabraSeleccionada}
                    onClose={cerrarDetallePalabra}
                />
            )}
        </div>
    );
};

export default PalabrasSeccion;