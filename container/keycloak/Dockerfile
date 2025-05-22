FROM quay.io/keycloak/keycloak:26.2.0 AS builder

ENV KC_HEALTH_ENABLED=false
ENV KC_METRICS_ENABLED=false
ENV LANG="en_US.UTF-8"
ENV KC_DB="dev-file"

WORKDIR /opt/keycloak
RUN /opt/keycloak/bin/kc.sh build
RUN cd data && mkdir import

FROM quay.io/keycloak/keycloak:26.2.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENV LANG="en_US.UTF-8"

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--import-realm", "--optimized", "--hostname", "localhost", "--http-enabled", "true"]

