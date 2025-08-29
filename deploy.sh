#!/bin/bash

echo "🚀 Déploiement de MyBank..."

# Vérifications
if [ ! -f "mybank.sql" ]; then
    echo "❌ Fichier mybank.sql introuvable"
    exit 1
fi

if [ ! -d "api" ]; then
    echo "❌ Dossier api/ introuvable"
    exit 1
fi

if [ ! -d "client" ]; then
    echo "❌ Dossier client/ introuvable"
    exit 1
fi

echo "✅ Structure vérifiée"

# Arrêt des anciens conteneurs
docker-compose down --volumes

# Construction et démarrage
echo "🔨 Construction des images..."
docker-compose build --no-cache

echo "🚀 Démarrage des services..."
docker-compose up -d

echo "⏳ Attente des services..."
sleep 30

echo "🎉 Déploiement terminé!"
echo ""
echo "Accès:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  Base:     localhost:3306"
echo ""
echo "Commandes:"
echo "  Logs:     docker-compose logs -f"
echo "  Arrêt:    docker-compose down"