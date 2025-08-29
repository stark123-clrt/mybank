# client/Dockerfile - Installation automatique des dépendances
FROM node:18-alpine

# Installation des dépendances système
RUN apk add --no-cache git

# Répertoire de travail
WORKDIR /app

# Variables d'environnement pour le développement
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Copie d'abord les fichiers de configuration
COPY package*.json ./

# Installation des dépendances Node.js
RUN npm ci --include=dev

# Copie du reste du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Commande pour démarrer en mode développement avec Vite directement
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "3000", "--no-hmr"]