# api/Dockerfile - Version optimisée avec cache
FROM php:8.2-fpm

# Installer les dépendances système et extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client \
    pkg-config \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/*

# Installer les extensions PHP
RUN docker-php-ext-install pdo_mysql mbstring zip intl

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir le dossier de travail
WORKDIR /var/www/html

# OPTIMISATION : Copier d'abord SEULEMENT les fichiers composer
# Cela permet au cache Docker de réutiliser cette couche si le code change
COPY composer.json composer.lock ./

# Changer d'utilisateur pour composer
USER www-data

# Installer les dépendances (sera mis en cache si composer.json ne change pas)
RUN composer install --no-dev --optimize-autoloader --no-interaction --verbose || \
    echo "Composer install a échoué, vérifie les logs"

# Revenir à root pour copier les fichiers
USER root

# MAINTENANT copier le reste du code
COPY . .

# Donner les permissions
RUN chown -R www-data:www-data /var/www/html

# Optimisation finale de composer
USER www-data
RUN composer dump-autoload --optimize

USER root

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]