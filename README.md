# PokerSquad

PokerSquad es una aplicación web que permite a grupos de amigos registrar sus partidas de póker, realizar un seguimiento de ganancias/pérdidas y mantener un ranking actualizado de los jugadores.

## Características Principales

- **Registro de Partidas**: Guarda información detallada sobre cada juego (fecha, jugadores, buy-in, ganadores, ganancias/pérdidas).
- **Historial de Partidas**: Visualiza todas las partidas jugadas con filtros y opciones de búsqueda.
- **Ranking de Jugadores**: Sistema automático de clasificación basado en partidas jugadas y ganancias.
- **Perfiles de Usuario**: Cada jugador tiene su propio perfil con estadísticas y récords personales.
- **Noticias de Póker**: Accede a noticias actualizadas sobre torneos y eventos importantes de póker.

## Estructura del Proyecto

```
PokerSquad/
├── .devcontainer/     # Configuración de DevContainers
├── frontend/          # Aplicación Angular 
├── backend/           # API del servidor (en desarrollo)
└── scraper/           # Herramientas para recopilar noticias de póker
```

## Entorno de Desarrollo

Este proyecto utiliza DevContainers para proporcionar un entorno de desarrollo consistente y fácil de configurar.

### Requisitos Previos

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Extensión Remote - Containers para VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Iniciar el Entorno de Desarrollo

1. Clona este repositorio
2. Abre el proyecto en VS Code
3. Cuando VS Code detecte la configuración de DevContainer, haz clic en "Reopen in Container"
   (Alternativa: presiona F1, escribe "Remote-Containers: Reopen in Container")
4. El contenedor se construirá automáticamente y configurará:
   - Node.js para el frontend
   - Las extensiones necesarias de VS Code
   - Instalación de dependencias del frontend

### Características del DevContainer

- Reenvío automático del puerto 4200 para la aplicación Angular
- Extensiones preinstaladas para Angular, Java, ESLint y Prettier
- Docker-outside-of-Docker habilitado para ejecutar contenedores desde dentro del DevContainer
- Inicialización automática del servidor de desarrollo del frontend

## Frontend

El frontend está desarrollado con Angular 19 y proporciona una interfaz de usuario intuitiva para gestionar partidas y visualizar estadísticas.

### Acceso Manual (sin DevContainer)

Si prefieres no usar DevContainers, necesitarás:

- Node.js (v18 o superior recomendado)
- npm (v9 o superior)

#### Instalación Manual

```bash
cd frontend
npm install
```

#### Ejecución en Desarrollo

```bash
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

#### Compilación para Producción

```bash
cd frontend
npm run build
```

## Backend (En Desarrollo)

El backend proporcionará una API RESTful para:
- Gestionar datos de partidas y jugadores
- Calcular estadísticas y rankings
- Autenticación de usuarios
- Almacenar imágenes de perfil

## Scraper

El componente scraper se encarga de recopilar noticias y resultados de los principales torneos de póker para mantener a los usuarios informados sobre el mundo profesional del póker.

## Plan de Desarrollo

### Tareas Pendientes

- Implementar el backend con una API RESTful y base de datos
- Desarrollar el scraper para noticias de póker
- Crear la interfaz de registro de partidas
- Implementar el algoritmo de ranking
- Desarrollar perfiles de usuario
- Añadir funcionalidades sociales (comentarios, invitaciones)
- Implementar sistema de autenticación

## Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT.