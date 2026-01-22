# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install ALL deps (needed for tsc + prisma)
RUN npm ci

# Copy source
COPY . .

# Build TS
RUN npm run build


# ---------- RUNTIME STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Prevent prisma generate here
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

# Copy only runtime deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built output & prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/server.js"]