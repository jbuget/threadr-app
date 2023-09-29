#!/bin/bash

# Définition des variables pour la connexion à la base de données
POSTGRES_USER="threadr_test"
POSTGRES_PASSWORD="threadr_test"
POSTGRES_DB="threadr_test"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5433"
POSTGRES_SCHEMA="public"

# Construction de l'URL de la base de données
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=${POSTGRES_SCHEMA}"

# Exporter DATABASE_URL comme une variable d'environnement
export DATABASE_URL

# Vérifiez si npx est installé
command -v npx >/dev/null 2>&1 || {
    echo >&2 "npx n'est pas installé. Installez-le en utilisant npm install -g npx et réessayez.";
    exit 1;
}

# Déployez les migrations avec Prisma
npx prisma migrate deploy

# Vérifiez le succès de la migration
if [ $? -eq 0 ]; then
    echo "Migration effectuée avec succès."
else
    echo "Erreur lors de la migration. Vérifiez les logs ci-dessus pour plus de détails."
    exit 1;
fi