#!/bin/sh
set -e

php bin/console cache:clear --env=prod --no-debug
php bin/console doctrine:migrations:migrate --no-interaction --env=prod

exec /usr/bin/supervisord -c /etc/supervisord.conf
