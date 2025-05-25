import { chromium, Browser, BrowserContext } from 'playwright';
import { NextResponse } from 'next/server';

// Interfaces para los tipos de datos
interface Example {
    source: string;
    target: string;
}

interface TranslationResult {
    translation: string;
    grammar: string | null;
    conceptType: string | null;
    examples: Example[];
}

// Cache global para reutilizar browser y context
let globalBrowser: Browser | null = null;
let globalContext: BrowserContext | null = null;

// Cache de resultados con TTL más largo
const cache = new Map<string, { data: TranslationResult[], timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos

// Función para obtener browser reutilizable
async function getBrowser(): Promise<Browser> {
    if (!globalBrowser || !globalBrowser.isConnected()) {
        globalBrowser = await chromium.launch({
            executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || 'undefined',
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-default-apps',
                '--no-first-run',
                '--disable-background-networking',
                '--disable-sync',
                '--disable-translate',
                '--disable-blink-features=AutomationControlled',
                '--disable-logging',
                '--disable-gpu',
                '--memory-pressure-off',
                '--max_old_space_size=4096',
                '--aggressive-cache-discard',
                '--disable-ipc-flooding-protection'
            ]
        });
    }
    return globalBrowser;
}

// Función para obtener context reutilizable
async function getContext(): Promise<BrowserContext> {
    const browser = await getBrowser();

    if (!globalContext || globalContext.browser() !== browser) {
        if (globalContext) {
            await globalContext.close();
        }
        globalContext = await browser.newContext({
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1024, height: 768 },
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            locale: 'en-US'
        });

        // Configurar interceptación global para el context
        await globalContext.route('**/*', (route) => {
            const request = route.request();
            const resourceType = request.resourceType();
            const url = request.url();

            // Bloquear recursos pesados
            if (['image', 'font', 'media', 'websocket', 'manifest'].includes(resourceType) ||
                url.includes('google-analytics') ||
                url.includes('gtag') ||
                url.includes('facebook') ||
                url.includes('twitter') ||
                url.includes('.jpg') ||
                url.includes('.png') ||
                url.includes('.gif') ||
                url.includes('.svg') ||
                url.includes('.woff')) {
                route.abort();
            } else {
                route.continue();
            }
        });
    }

    return globalContext;
}

// Para parámetros de consulta (query parameters)
export async function GET(request: Request) {
    const startTime = Date.now();

    // Obtener la URL de la solicitud
    const { searchParams } = new URL(request.url);

    // Obtener parámetros específicos
    const src = searchParams.get('src');
    const dst = searchParams.get('dst');
    const word = searchParams.get('word');

    if (!word || !src || !dst) {
        return NextResponse.json({ error: 'Se requieren los parámetros "word", "src" y "dst"' }, { status: 400 });
    }

    // Crear clave de cache
    const cacheKey = `${src}-${dst}-${word.toLowerCase()}`;

    // Verificar cache
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        console.log(`Cache hit para "${word}" (${Date.now() - startTime}ms)`);
        return NextResponse.json(cached.data);
    }

    const glosbeUrl = `https://glosbe.com/${src}/${dst}/${encodeURIComponent(word)}`;

    try {
        const context = await getContext();
        const page = await context.newPage();

        // Configuraciones de velocidad más agresivas
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Cache-Control': 'no-cache'
        });

        // Navegar con timeout muy reducido
        await page.goto(glosbeUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 4000
        });

        // Manejo rápido del consentimiento
        try {
            await page.locator('button.fc-cta-consent.fc-primary-button').first().click({ timeout: 1000 });
            await page.waitForTimeout(200);
        } catch {
            // Continuar sin consentimiento
        }

        // Esperar contenido con timeout muy reducido
        await page.waitForSelector('#dictionary-content', { timeout: 3000 });

        // Scraping ultra optimizado
        const results = await page.evaluate((): TranslationResult[] => {
            const items = document.querySelectorAll('ul.pr-1 li.translation__item');
            const translations: TranslationResult[] = [];

            // Limitar a 6 elementos para máxima velocidad
            const maxItems = Math.min(items.length, 6);

            for (let i = 0; i < maxItems; i++) {
                const item = items[i];

                // Traducción principal
                const translationEl = item.querySelector('h3.translation__item__pharse');
                if (!translationEl) continue;

                const translation = translationEl.textContent?.trim();
                if (!translation) continue;

                // Información gramatical (optimizada)
                const grammarEls = item.querySelectorAll('span.text-xxs.text-gray-500 span');
                const grammar = grammarEls.length > 0
                    ? Array.from(grammarEls, el => el.textContent?.trim()).filter(Boolean).join(' ') || null
                    : null;

                // Tipo de concepto (optimizado)
                const conceptEl = item.querySelector('p.translation__definition span[lang], p.translation__definition span');
                const conceptType = conceptEl?.textContent?.trim() || null;

                // Ejemplos (solo el primero para velocidad)
                const exampleParagraphs = item.querySelectorAll('div.translation__example p');
                const examples: Example[] = [];

                if (exampleParagraphs.length >= 2) {
                    const source = exampleParagraphs[0]?.textContent?.trim();
                    const target = exampleParagraphs[1]?.textContent?.trim();

                    if (source && target && source !== target) {
                        examples.push({
                            source: source.replace(/["""]/g, '"'),
                            target: target.replace(/["""]/g, '"')
                        });
                    }
                }

                translations.push({
                    translation,
                    grammar,
                    conceptType,
                    examples
                });
            }

            return translations;
        });

        // Cerrar página inmediatamente
        await page.close();

        // Deduplicar rápidamente
        const seen = new Set<string>();
        const uniqueResults = results.filter(result => {
            if (seen.has(result.translation)) return false;
            seen.add(result.translation);
            return true;
        });

        // Guardar en cache
        cache.set(cacheKey, {
            data: uniqueResults,
            timestamp: Date.now()
        });

        const totalTime = Date.now() - startTime;
        console.log(`Scraping ultra-rápido para "${word}": ${uniqueResults.length} resultados en ${totalTime}ms`);

        return NextResponse.json(uniqueResults);

    } catch (error) {
        console.error('Error en el procesamiento:', error);
        return NextResponse.json({ error: 'Error en el procesamiento' }, { status: 500 });
    }
}

// Limpiar recursos al cerrar
process.on('beforeExit', async () => {
    if (globalContext) {
        await globalContext.close();
    }
    if (globalBrowser) {
        await globalBrowser.close();
    }
});