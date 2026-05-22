# --- ESTADIO DE DESARROLLO / CONSTRUCCIÓN ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 👇 1. Declaramos que Docker recibirá esta variable desde el exterior
ARG VITE_API_BASE_URL

# 👇 2. La convertimos en una variable de entorno interna para que Vite la pueda ver al compilar
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Construye para producción (Vite leerá la variable de entorno aquí mismo)
RUN npm run build

# --- ESTADIO DE PRODUCCIÓN ---
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]