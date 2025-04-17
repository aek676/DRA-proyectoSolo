# Imagen base con herramientas de desarrollo
FROM mcr.microsoft.com/devcontainers/base:bullseye

# Instalar Node.js 
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get -y install --no-install-recommends nodejs \
    && npm install -g npm@latest

# Instalar Java para SpringBoot
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends openjdk-17-jdk maven \
    && java -version && mvn -version

# Instalar herramientas de desarrollo adicionales
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    wget \
    jq \
    python3 \
    python3-pip \
    zip \
    unzip \
    postgresql-client

# Limpiar caché de apt para reducir el tamaño de la imagen
RUN apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Configurar variables de entorno
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"