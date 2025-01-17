# Panda 2

docker stop Panda2

docker rm Panda2

docker rmi erpbarczok:latest

docker buildx build -t erpbarczok:latest --network host .

docker run \
    -i \
    -p 8080:8080 \
    --net=host \
    -e NODE_ENV='production' \
    -e DEBUG='panda2:*' \
    -e DB_NAME='panda2_db' \
    -e DB_USER='panda2_app' \
    -e DB_PASSWORD='blablubber' \
    -e DB_HOST='localhost' \
    --rm \
    erpbarczok:latest

# Postgres

docker run -e POSTGRES_PASSWORD="blablubber" -p 8080:5432 -d --rm postgres:17.2-alpine3.20