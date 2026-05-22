FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Instalamos solo dependencias de producción para aligerar la imagen
RUN npm install --only=production

COPY . .

# Render ignorará el EXPOSE físico y usará su variable interna, 
# pero dejarlo documentado aquí es una buena práctica.
EXPOSE 3000

# Eliminamos la bandera --env-file para producción. 
# Node leerá las variables directamente del entorno del servidor.
CMD ["node", "server.js"]