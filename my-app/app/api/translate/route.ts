import { translate } from "@vitalets/google-translate-api"
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Parse the JSON body from the request
        const body = await request.json();

        // Extract the required fields
        const { text, from, to } = body;

        // Validate the input
        if (!text || !from || !to) {
            return NextResponse.json(
                { error: 'Missing required fields: text, from, or to' },
                { status: 400 }
            );
        }

        const { text: translatedText } = await translate(text, {
            from: from,
            to: to,
        });

        // Return the response
        return NextResponse.json({
            originalText: text,
            from,
            to,
            translatedText // Cambiado de 'translatedText' a 'text' para coincidir con lo que espera el cliente
        });

    } catch (error) {
        // Handle any errors
        console.error('Translation error:', error);
        return NextResponse.json(
            { error: 'Failed to process translation request', message: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}