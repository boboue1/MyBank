FROM php:8.2-fpm-alpine

RUN apk add --no-cache git unzip libpng-dev libzip-dev zip nginx supervisor && \
    docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer*.json ./
RUN composer install --no-dev --optimize-autoloader --no-autoloader

COPY . .
RUN composer dump-autoload --optimize

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && mkdir -p /run/nginx

EXPOSE 80

CMD ["/entrypoint.sh"]