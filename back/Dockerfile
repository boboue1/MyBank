FROM php:8.2-fpm-alpine

RUN apk add --no-cache git unzip libzip-dev zip nginx supervisor openssl && \
    docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction

COPY . .
RUN echo "APP_ENV=prod" > .env
RUN composer dump-autoload --optimize --classmap-authoritative

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && mkdir -p /run/nginx var/cache var/log

EXPOSE 80
CMD ["/entrypoint.sh"]
