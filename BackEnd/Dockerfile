FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Usamos node_env=development para asegurar que se escuche en el puerto
ENV NODE_ENV=development

CMD ["node", "--env-file=.env", "server.js"]
