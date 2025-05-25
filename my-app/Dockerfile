# Usar imagen base más ligera y específica
FROM node:18-alpine AS base

# Instalar dependencias del sistema necesarias para Playwright
RUN apk add --no-cache \
    chromium \
    firefox \
    ttf-freefont \
    font-noto-emoji \
    && rm -rf /var/cache/apk/*

# Configurar variables de entorno para Playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Instalar dependencias solo cuando sean necesarias
FROM base AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar todas las dependencias (dev + prod) para el build
RUN npm ci && \
    npm cache clean --force

# Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app

# Copiar dependencias ya instaladas
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configurar variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Construir la aplicación
RUN npm run build

# Imagen de producción optimizada
FROM node:18-alpine AS runner
WORKDIR /app

# Instalar solo las dependencias mínimas del sistema
RUN apk add --no-cache \
    chromium \
    dumb-init \
    ttf-freefont \
    font-noto-emoji \
    && rm -rf /var/cache/apk/*

# Configurar variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Crear usuario sin privilegios
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar solo las dependencias de producción
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Crear directorio .next con permisos correctos
RUN mkdir -p .next && chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]