## prerequisites
docker
node
npm/npx
psql (available with docker container, using container terminal).

## dev start

create database and migrate.
chmod +x ./scripts/init_db.sh
chmod +x ./src/scripts/insert_assets.ts

# create db
./scripts/init_db.sh
# populate db
npm run backfill
# start application.
npm run dev


