
```psql
create User erpbarczok_app with Password 'blablubber';

Grant azure_pg_admin to erpbarczok_app;

create database erpbarczok_db;

grant connect on Database erpbarczok_db to erpbarczok_app;

grant all privileges on Database erpbarczok_db to erpbarczok_app;
```