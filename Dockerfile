FROM node:23.11-alpine

# Arbeitsverzeichnis im Container setzen
WORKDIR /app

# Umgebungsvariablen setzen
ENV NODE_ENV=development
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Systemabhängigkeiten installieren
RUN apt-get update \
    && apt-get install -y \
    git \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm install

# Den Rest des Projektordners kopieren
COPY . .

# Port freigeben, den Expo standardmäßig verwendet
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081
# Startbefehl
CMD ["npm", "start"]