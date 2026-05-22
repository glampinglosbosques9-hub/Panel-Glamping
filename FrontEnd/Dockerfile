# --- ETAPA DE COMPILACIÓN ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- ETAPA DE EJECUCIÓN ---
# Exponemos el puerto 3000 (seguro para Linux/Alpine)
EXPOSE 3000

# Usamos npx para ejecutar 'serve' de forma directa.
# "-s" activa el modo Single Page Application (redirecciona todas tus rutas al index.html).
# "-l 3000" le dice que escuche específicamente en el puerto 3000.
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]