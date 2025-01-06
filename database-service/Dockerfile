# database-service/Dockerfile
FROM postgres:13-alpine

# Copy initialization scripts
COPY init-scripts/ /docker-entrypoint-initdb.d/

# Copy custom PostgreSQL configuration
COPY config/postgresql.conf /etc/postgresql/postgresql.conf

EXPOSE 5432

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD pg_isready -U ${POSTGRES_USER} || exit 1