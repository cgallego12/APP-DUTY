# Etapa de construcción
FROM node:22-slim AS build

# Instalar pnpm
RUN npm install -g pnpm

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN pnpm build

# Etapa de producción
FROM nginx:stable-alpine

# Copiar los archivos construidos desde la etapa anterior al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar una configuración personalizada de nginx si fuera necesario
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
