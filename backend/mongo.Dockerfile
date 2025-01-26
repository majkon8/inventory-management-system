FROM mongo:6.0

ENV MONGO_PORT=27017

EXPOSE $MONGO_PORT

HEALTHCHECK CMD echo 'db.runCommand("ping").ok' | mongosh 127.0.0.1:$MONGO_PORT/test --quiet || exit 1

ENTRYPOINT docker-entrypoint.sh mongod --port $MONGO_PORT
