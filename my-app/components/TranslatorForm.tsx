import React from 'react';
import { Textarea } from './ui/textarea';

export default function TranslatorForm() {
    return(
        <div>
            <h1>Translator</h1>
            <Textarea/>
            <Textarea disabled/>
        </div>
    )
};
