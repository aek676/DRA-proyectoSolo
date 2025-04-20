import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

// Definir la interfaz para el objeto de idioma
interface Language {
  name: string;
  code: string;
}

export async function GET() {
  try {
    // URL de la documentación de Google
    const url = 'https://cloud.google.com/translate/docs/languages';

    // Obtener el HTML de la página
    const response = await axios.get(url);
    const html = response.data;

    // Cargar el HTML en cheerio
    const $ = cheerio.load(html);

    // Encontrar la tabla de idiomas
    const languages: Language[] = [];

    // Buscar las filas de la primera tabla que contiene los idiomas
    // Seleccionar solo la primera tabla que cumpla con el selector
    const table = $('table').first().find('tbody tr');

    table.each((index, element) => {
      const columns = $(element).find('td');

      // Si hay columnas en esta fila
      if (columns.length >= 2) {
        const language: Language = {
          name: $(columns[0]).text().trim(),
          code: $(columns[1]).find('code').text().trim()
        };

        // Solo añadir si el código no está vacío
        if (language.code) {
          languages.push(language);
        }
      }
    });

    // Devolver los idiomas como respuesta JSON
    return NextResponse.json({ languages });
  } catch (error) {
    console.error('Error al scrapear los idiomas:', error);
    return NextResponse.json(
      { error: 'Error al obtener los idiomas' },
      { status: 500 }
    );
  }
}