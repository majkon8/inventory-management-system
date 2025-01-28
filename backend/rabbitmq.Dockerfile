FROM rabbitmq:3.12-management

ENV CONFIG_FILE=/etc/rabbitmq/rabbitmq.conf

ARG RABBITMQ_MANAGEMENT_PORT=15672
ARG VM_MEMORY_HIGH_WATERMARK_ABSOLUTE=2G
ARG DISK_FREE_LIMIT_ABSOLUTE=4G

COPY ./rabbitmq.conf /etc/rabbitmq/rabbitmq.conf

RUN sed -i "s/__MANAGEMENT_PORT__/${RABBITMQ_MANAGEMENT_PORT}/g" /etc/rabbitmq/rabbitmq.conf && \
    sed -i "s/__VM_MEMORY_HIGH_WATERMARK_ABSOLUTE__/${VM_MEMORY_HIGH_WATERMARK_ABSOLUTE}/g" /etc/rabbitmq/rabbitmq.conf && \
    sed -i "s/__DISK_FREE_LIMIT_ABSOLUTE__/${DISK_FREE_LIMIT_ABSOLUTE}/g" /etc/rabbitmq/rabbitmq.conf

HEALTHCHECK CMD rabbitmq-diagnostics ping || exit 1
