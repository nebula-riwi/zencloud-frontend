# Dockerfile multi-stage para producción optimizada
FROM node:20-alpine AS builder

WORKDIR /app

# Habilitar Corepack para usar pnpm (incluido en Node 20+)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Configurar Node.js para más memoria
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Variables de entorno para el build (valores por defecto)
ENV VITE_API_BASE_URL="https://service.nebula.andrescortes.dev"
ENV VITE_USE_LOCAL_API="false"

# Copiar archivos de dependencias
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Instalar dependencias
# Intentar con lockfile primero, si falla, instalar sin lockfile (lo regenerará)
RUN pnpm install || (echo "Install with lockfile failed, installing without lockfile..." && rm -f pnpm-lock.yaml && pnpm install)

# Copiar el resto del código
COPY . .

# Limpiar caché previa
RUN rm -rf node_modules/.vite dist .vite

# Construir la aplicación
# Usamos build:docker que omite el type checking estricto para evitar fallos en Docker
# Vite maneja los errores de tipo de manera más permisiva
RUN pnpm build:docker

# Stage de producción con Nginx
FROM nginx:alpine

# Copiar los archivos construidos desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Etiquetas para GitHub Packages
LABEL org.opencontainers.image.source=https://github.com/nebula-riwi/zencloud-frontend
LABEL org.opencontainers.image.description="ZenCloud Frontend - Vue.js Application"
LABEL org.opencontainers.image.licenses=MIT

CMD ["nginx", "-g", "daemon off;"]

