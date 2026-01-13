# This Dockerfile uses Turbo's prune command to create an optimized build
# It only includes the dependencies needed for this specific app

FROM node:22.13.1-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Pruner stage - extract only what this app needs
FROM base AS pruner
RUN apk add --no-cache libc6-compat
COPY . .
RUN pnpm turbo prune react-app --docker

# Installer stage - install dependencies
FROM base AS installer
RUN apk add --no-cache libc6-compat

# Copy pruned lockfile and package.json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# Build the app
RUN pnpm turbo run build --filter=react-app

# Development stage
FROM base AS dev
RUN apk add --no-cache libc6-compat

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

WORKDIR /app/apps/react-app
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# Production stage - serve with nginx
FROM nginx:alpine AS prod

# Copy built files
COPY --from=installer /app/apps/react-app/dist /usr/share/nginx/html

# Create nginx config for SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
