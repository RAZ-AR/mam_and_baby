# Multi-stage build for API
FROM node:20-alpine AS base

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy API package files
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma/

# Install dependencies
FROM base AS dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build stage
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api

# Generate Prisma Client and build
WORKDIR /app/apps/api
RUN npx prisma generate
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy built files
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/package.json ./

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 4000

# Set production environment
ENV NODE_ENV=production

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
