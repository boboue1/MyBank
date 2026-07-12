#!/bin/sh
set -e

# Generate JWT keys if missing
if [ ! -f config/jwt/private.pem ]; then
    mkdir -p config/jwt
    openssl genpkey -algorithm RSA -out config/jwt/private.pem -aes256 -pass pass:${JWT_PASSPHRASE}
    openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:${JWT_PASSPHRASE}
fi

mkdir -p var/cache var/log

php bin/console cache:clear --no-debug --no-warmup

chown -R www-data:www-data var/ config/jwt/

php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

exec /usr/bin/supervisord -c /etc/supervisord.conf
