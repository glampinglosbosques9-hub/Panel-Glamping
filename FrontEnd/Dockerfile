# --- ETAPA DE COMPILACIÓN ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- ETAPA DE EJECUCIÓN (SIN NGINX) ---
# Instalamos un servidor estático ligero globalmente en Node
RUN npm install -g serve

EXPOSE 80

# Ejecutamos 'serve' apuntando a la carpeta de compilación 
# La bandera "-s" reenvía las rutas al index.html para evitar el error 404
CMD ["serve", "-s", "dist", "-l", "80"]
