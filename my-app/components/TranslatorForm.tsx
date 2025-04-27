'use client'

import React, { useState, useEffect } from 'react';
import { ComboBox } from './ComboBox';
import { Textarea } from './ui/textarea';
import useSWR from "swr"
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import { useDebounce } from '@uidotdev/usehooks';
import PalabrasSeccion from './PalabrasSeccion';

export default function TranslatorForm() {
    const [sourceLanguage, setSourceLanguage] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);
    const debounceTerm = useDebounce(sourceText, 600);
    // Estado para palabras individuales
    const [palabrasSource, setPalabrasSource] = useState<string[]>([]);
    // Ya no necesitamos mantener el estado de palabras traducidas
    // const [palabrasTranslated, setPalabrasTranslated] = useState<string[]>([]);

    const { data, error, isLoading } = useSWR('/api/languages', fetcher);

    // Mostrar el mensaje de error cuando hay un problema con la carga de datos
    useEffect(() => {
        if (error) {
            toast.error("No se encontraron idiomas disponibles");
        }
    }, [error]);

    // Usamos un array vacío si los datos no están disponibles aún
    const languages = data?.languages || [];

    // Actualizamos las palabras cuando cambia el texto fuente
    useEffect(() => {
        if (sourceText) {
            setPalabrasSource(sourceText.split(' ').filter(word => word.trim() !== ''));
        } else {
            setPalabrasSource([]);
        }
    }, [sourceText]);

    // Ya no necesitamos este efecto que procesaba las palabras traducidas
    /*
    useEffect(() => {
        if (translatedText) {
            setPalabrasTranslated(translatedText.split(' ').filter(word => word.trim() !== ''));
        } else {
            setPalabrasTranslated([]);
        }
    }, [translatedText]);
    */

    useEffect(() => {
        const handleTranslate = async () => {
            if (!sourceLanguage || !targetLanguage || !sourceText) return;

            setIsTranslating(true);
            try {
                console.log(`Traduciendo de ${sourceLanguage} a ${targetLanguage}: "${sourceText}"`);

                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: sourceText,
                        from: sourceLanguage,
                        to: targetLanguage
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const result = await response.json();

                setTranslatedText(result.translatedText);
                toast.success("Traducción completada");
            } catch (error) {
                console.error("Error en la traducción:", error);
                toast.error("Error al traducir el texto. Intenta de nuevo.");
                setTranslatedText("Error en la traducción");
            } finally {
                setIsTranslating(false);
            }
        };

        handleTranslate();
    }, [debounceTerm])

    return (
        <div className="flex flex-col space-y-4 p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">Traductor</h1>
            <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">Idioma de origen</label>
                    <ComboBox
                        items={languages}
                        placeholder={isLoading ? "Cargando idiomas..." : "Selecciona idioma origen"}
                        searchPlaceholder="Buscar idioma..."
                        emptyMessage={isLoading ? "Cargando idiomas..." : "No se encontró el idioma."}
                        onChange={setSourceLanguage}
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">Idioma de destino</label>
                    <ComboBox
                        items={languages}
                        placeholder={isLoading ? "Cargando idiomas..." : "Selecciona idioma destino"}
                        searchPlaceholder="Buscar idioma..."
                        emptyMessage={isLoading ? "Cargando idiomas..." : "No se encontró el idioma."}
                        onChange={setTargetLanguage}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">Texto a traducir</label>
                    <Textarea
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        placeholder="Escribe el texto a traducir"
                        className="min-h-[150px]"
                    />
                </div>
                <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">Traducción</label>
                    <Textarea
                        value={translatedText}
                        readOnly
                        placeholder={isTranslating ? "Traduciendo..." : "Traducción"}
                        className="min-h-[150px]"
                    />
                </div>
            </div>

            {/* Componente de palabras individuales */}
            <PalabrasSeccion
                palabrasSource={palabrasSource}
            />
        </div>
    );
}

