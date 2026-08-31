# syntax=docker/dockerfile:1
#
# Build context is the REPO ROOT (see docker-compose.yml `web.build.context`),
# not frontend-rag/ — this image also needs ../nginx/default.conf.template,
# and docker-compose can't build from two contexts at once.

FROM node:20-alpine AS build

WORKDIR /app

COPY frontend-rag/package.json frontend-rag/package-lock.json ./
RUN npm ci

COPY frontend-rag/ .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine

COPY --from=build /app/dist/rag-groq-frontend/browser /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

ENV API_KEY=""

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
