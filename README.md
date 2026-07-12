# MyBank

Application de gestion bancaire personnelle — suivi des opérations et des catégories de dépenses.

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React 19 + Vite + React Router |
| Backend | Symfony 7.4 + PHP 8.2 |
| Auth | LexikJWT (cookie HttpOnly en production, header en test) |
| BDD prod | MySQL 8.0 |
| BDD test | SQLite |
| Infra | Docker (PHP-FPM + Nginx + Supervisor) |
| CI/CD | GitHub Actions → Railway |

## Lancer le projet en local (Docker)

```bash
docker compose up --build
```

- Frontend : http://localhost:3000
- API : http://localhost:8000/api

## Backend seul (sans Docker)

```bash
cd back
composer install
php bin/console lexik:jwt:generate-keypair
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
symfony serve
```

## Frontend seul (sans Docker)

```bash
cd front
npm install
npm run dev
```

## Tests backend

Générer les clés JWT pour l'environnement de test (à faire une seule fois) :

```bash
cd back
php bin/console lexik:jwt:generate-keypair -n --env=test
```

Lancer les tests :

```bash
php bin/phpunit
```

## Linter frontend

```bash
cd front
npm run lint
```

## CI/CD

Les trois jobs GitHub Actions se déclenchent à chaque push sur `develop` ou `main` :

1. **Tests backend** — PHPUnit (SQLite, clés JWT générées à la volée)
2. **Lint frontend** — ESLint
3. **Build Docker** — vérifie que les images se construisent (dépend des deux jobs précédents)

Railway redéploie automatiquement après que tous les jobs CI passent.

## Variables d'environnement

Copier `.env` et ajuster les valeurs :

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL de connexion à la base de données |
| `JWT_PASSPHRASE` | Passphrase de la clé privée JWT |
| `JWT_SECRET_KEY` | Chemin vers la clé privée |
| `JWT_PUBLIC_KEY` | Chemin vers la clé publique |
| `CORS_ALLOW_ORIGIN` | Origine autorisée pour les requêtes cross-origin |

Lien de l'application
https://adequate-smile-production-43a6.up.railway.app/login