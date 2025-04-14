FROM node:23.11-alpine

WORKDIR /app

ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

COPY package.json package-lock.json ./

RUN npm install

# Den Rest des Projektordners kopieren
COPY . .

EXPOSE 8081
# Startbefehl
CMD ["npm", "run", "start"]