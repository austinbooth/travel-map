export PSQL_CONTAINER_HOST=$(dig psql +short)
export DATABASE_URL="postgresql://postgres:${POSTGRES_PASSWORD}@${PSQL_CONTAINER_HOST}:${POSTGRES_PORT}/dev"
