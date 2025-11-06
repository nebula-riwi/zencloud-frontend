# Dockerfile multi-stage para producción optimizada
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Instalar pnpm si es necesario
RUN npm install -g pnpm

# Instalar dependencias (sin frozen-lockfile para permitir actualizaciones)
RUN pnpm install

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN pnpm build

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

