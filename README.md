# Frasea - Traductor con Historial Descargable en PDF

Una aplicación web con Next.js que permite traducir texto, guardar un historial de traducciones y exportarlo a PDF, además de extraer frases de ejemplo desde WordReference.

## Características Principales

- **Traductor de Texto**: Traduce texto utilizando la API de Google Translate (@vitalets/google-translate-api).
- **Historial de Traducciones**: Guarda cada traducción en base de datos y permite visualizarlas en una tabla.
- **Gestión de Traducciones**: Permite editar y eliminar traducciones guardadas.
- **Exportación a PDF**: Permite descargar el historial completo de traducciones en formato PDF.
- **Extracción de Frases**: Busca y extrae frases de ejemplo desde WordReference mediante scraping.

## Estructura del Proyecto

```
Frasea/
├── frontend/        # Aplicación Next.js 
│   ├── app/         # Carpetas de rutas y componentes (App Router)
│   ├── pages/       # API Routes y páginas (opcional, si usas Pages Router)
│   ├── components/  # Componentes reutilizables
│   ├── lib/         # Utilidades y helpers
│   ├── public/      # Archivos estáticos
│   └── styles/      # Estilos globales
└── scraper/         # Herramientas para extracción de frases desde WordReference
```

## Funcionalidades Implementadas

### 🔠 Traductor de texto
- Input para escribir un texto
- Selección de idiomas origen y destino
- Integración con @vitalets/google-translate-api
- Visualización del resultado de la traducción

### 🧾 Historial de traducciones
- Almacenamiento de traducciones en base de datos MongoDB
- Visualización en tabla/listado en frontend
- Funcionalidad para editar traducciones guardadas
- Funcionalidad para eliminar traducciones
- Exportación del historial completo a PDF

### 🕷 Scraping de frases desde WordReference
- Input para buscar una palabra
- Extracción de frases de ejemplo (inglés + español) desde WordReference
- Visualización de frases extraídas
- Opción para seleccionar una frase y traducirla
- Funcionalidad para guardar directamente al historial

## Entorno de Desarrollo

### Requisitos Previos

- Node.js (v18 o superior recomendado)
- npm (v9 o superior)
- MongoDB (local o en la nube)

### Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias 
cd frontend
npm install
```

### Ejecución en Desarrollo

```bash
# Iniciar la aplicación Next.js (frontend + backend)
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:3000/`

## Tecnologías Utilizadas

- **Frontend y Backend**: Next.js, React, TailwindCSS
- **Base de Datos**: MongoDB
- **Traducción**: @vitalets/google-translate-api
- **Generación PDF**: jsPDF o similar
- **Scraping**: Axios y Cheerio para extracción de frases desde WordReference
- **API Routes**: Endpoints de Next.js para la comunicación con la base de datos

## Plan de Desarrollo

### Tareas Pendientes

- Migrar el proyecto actual de Angular a Next.js
- Implementar la interfaz de usuario con Next.js y TailwindCSS
- Configurar la conexión con MongoDB
- Crear API Routes para gestionar las traducciones
- Integrar la API de traducción
- Desarrollar el scraper para WordReference utilizando Axios y Cheerio
- Implementar la funcionalidad de exportación a PDF
- Añadir funcionalidades de edición/eliminación de traducciones
- Optimizar la interfaz de usuario
- Mejorar la experiencia móvil

## Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.