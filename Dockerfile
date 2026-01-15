# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies needed for Prisma
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Stage 2: Runtime
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT 80
ENV HOSTNAME 0.0.0.0

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/db

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose the port
EXPOSE 80

# Start the application
CMD echo "Starting Wavy..." && \
    mkdir -p /app/db && \
    npx prisma db push && \
    echo "Database ready, starting Next.js on port 80..." && \
    npx next start -p 80 -H 0.0.0.0