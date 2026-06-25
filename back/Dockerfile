FROM php:8.2-fpm-alpine
RUN apk add --no-cache git unzip libpng-dev libzip-dev zip && \
    docker-php-ext-install pdo pdo_mysql zip
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY composer*.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-autoloader
COPY . .
RUN composer dump-autoload --optimize
EXPOSE 9000
CMD ["php-fpm"]