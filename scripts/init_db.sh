#!/usr/bin/env bash
set -x
set -eo pipefail
# check for satoshi stack db build prereqs
if ! [ -x "$(command -v psql)" ]; then
    echo >&2 "Error: psql is not installed."
    exit 1
fi

if ! [ -x "$(command -v npx)" ]; then
    echo >&2 "Error: npx is not installed."
    exit 1
fi

DB_USER="${POSTGRES_USER:=postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:=password}"

DB_NAME="${POSTGRES_DB:=satoshi01}"
DB_PORT="${POSTGRES_PORT:=5432}"
DB_HOST="${POSTGRES_HOST:=localhost}"
# allow skip docker build, if container is already running
if [[ -z "${SKIP_DOCKER}" ]]
then
    docker run \
        -e POSTGRES_USER=${DB_USER} \
        -e POSTGRES_PASSWORD=${DB_PASSWORD} \
        -e POSTGRES_DB=${DB_NAME} \
        -p "${DB_PORT}":5432 \
        -d postgres \
        postgres -N 1000

fi

export PGPASSWORD="${DB_PASSWORD}"
until psql -h "${DB_HOST}" -U "${DB_USER}" -p "${DB_PORT}" -d "postgres" -c '\q'; do
    >&2 echo "Postgres is still unavailable - sleeping."
    sleep 1
done

>&2 echo "Postgres is up and running on port ${DB_PORT}! Starting migrations..."

#psql -U "${DB_USER}" -h "${DB_HOST}" -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || psql "${DB_USER}" -h "${DB_HOST}" -c "CREATE DATABASE ${DB_NAME}"

DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
export DATABASE_URL


# TODO use `npx prisma migrate dev` `prisma migrate status` to perform some checks and migrate only if successful.
# also consider the role of npx prisma migrate status, npx prisma migrate reset, and npx prisma migrate format
# in this logic:
# npx prisma migrate status === "happy" ? npx prisma migrate deploy : prisma migrate reset
npx prisma migrate dev --name init
npx prisma migrate deploy

>&2 echo "Postgres has been migrated. Ready to go."
