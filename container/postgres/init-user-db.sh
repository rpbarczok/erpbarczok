#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE USER keycloak WITH CREATEDB PASSWORD 'blablubber';
    SET ROLE keycloak;
	CREATE DATABASE keycloak_db;
	SET ROLE postgres;
    ALTER ROLE keycloak WITH NOCREATEDB;
    CREATE USER erpbarczok_app WITH CREATEDB PASSWORD 'blablubber';
    SET ROLE erpbarczok_app;
    CREATE DATABASE erpbarczok_db;
	SET ROLE postgres;
    ALTER ROLE erpbarczok_app WITH NOCREATEDB;
EOSQL