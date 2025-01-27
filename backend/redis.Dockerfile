FROM redis:7.0

ENV REDIS_PORT=6379

EXPOSE $REDIS_PORT

HEALTHCHECK CMD redis-cli -p $REDIS_PORT ping || exit 1

ENTRYPOINT redis-server --port $REDIS_PORT --requirepass $REDIS_PASS
