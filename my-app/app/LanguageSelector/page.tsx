'use client'

import { useState } from "react";
import languages from '@/lib/languages.json';
import { ComboBox } from "@/components/ComboBox";

export default function LanguageSelector() {
    const [selectedLanguage, setSelectedLanguage] = useState("");

    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
        console.log("Idioma seleccionado:", value);
    };

    return (
        <div className="w-64 p-2 bg-white shadow-lg rounded-xl">
            <div>
                <ComboBox
                    items={languages.languages}
                    placeholder="Selecciona un idioma"
                    searchPlaceholder="Buscar idioma..."
                    emptyMessage="No se encontró el idioma."
                    onChange={handleLanguageChange}
                    className="w-[200px]"
                />
            </div>
        </div>
    );
}
