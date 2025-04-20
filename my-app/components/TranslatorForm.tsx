'use client'

import React, { useState } from 'react';
import { ComboBox } from './ComboBox';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import useSWR from "swr"
import { fetcher } from '@/lib/fetcher';


export default function TranslatorForm() {
    const [sourceLanguage, setSourceLanguage] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [sourceText, setSourceText] = useState("");
    const [translatedText, setTranslatedText] = useState("");


    const { data, error } = useSWR('/api/languages', fetcher);

    if (error) return <div>Error al cargar los idiomas</div>;
    if (!data) return;

    const languages = data.languages;

    const handleTranslate = () => {
        // Simulación de traducción (en un caso real, llamaríamos a una API)
        setTranslatedText(`Texto traducido del idioma ${sourceLanguage} al idioma ${targetLanguage}`);
        console.log("Traduciendo de", sourceLanguage, "a", targetLanguage);
    };

    return (
        <div className="flex flex-col space-y-4 p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">Traductor</h1>

            <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">Idioma de origen</label>
                    <ComboBox
                        items={languages}
                        placeholder="Selecciona idioma origen"
                        searchPlaceholder="Buscar idioma..."
                        emptyMessage="No se encontró el idioma."
                        onChange={setSourceLanguage}
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">Idioma de destino</label>
                    <ComboBox
                        items={languages}
                        placeholder="Selecciona idioma destino"
                        searchPlaceholder="Buscar idioma..."
                        emptyMessage="No se encontró el idioma."
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
                        placeholder="Resultado de la traducción"
                        className="min-h-[150px]"
                    />
                </div>
            </div>

            <Button
                onClick={handleTranslate}
                disabled={!sourceLanguage || !targetLanguage || !sourceText}
                className="w-full sm:w-auto ml-auto"
            >
                Traducir
            </Button>
        </div>
    );
}

