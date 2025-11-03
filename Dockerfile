# ---------- Build Stage ----------
FROM node:20-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml* ./

# Install all dependencies (dev + prod) for build
RUN pnpm install

# Copy source code
COPY . .

# Disable ERD generation (puppeteer)
ENV DISABLE_ERN_GENERATOR=true

# Generate Prisma client
RUN pnpm prisma generate

# Build the NestJS app
RUN pnpm run build

# Prune dev dependencies (skip scripts to avoid husky errors)
RUN pnpm prune --prod --ignore-scripts

# ---------- Production Stage ----------
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./

# Copy production node_modules (already pruned)
COPY --from=builder /app/node_modules ./node_modules

# Copy generated Prisma client
COPY --from=builder /app/generated/prisma ./generated/prisma

# Copy built app
COPY --from=builder /app/dist ./dist

# Define build arguments for environment variables
ARG PORT
ARG NODE_ENV
ARG APP_NAME
ARG DATABASE_URL
ARG JWT_SECRET
ARG ALLOWED_ORIGINS
ARG S3_ACCESS_KEY_ID
ARG S3_ACCESS_KEY_SECRET
ARG S3_REGION
ARG S3_SIGNATURE_VERSION
ARG S3_BUCKET
ARG S3_BASE_URL

# Set environment variables
ENV PORT=$PORT \
    NODE_ENV=$NODE_ENV \
    APP_NAME=$APP_NAME \
    DATABASE_URL=$DATABASE_URL \
    JWT_SECRET=$JWT_SECRET \
    ALLOWED_ORIGINS=$ALLOWED_ORIGINS \
    S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
    S3_ACCESS_KEY_SECRET=$S3_ACCESS_KEY_SECRET \
    S3_REGION=$S3_REGION \
    S3_SIGNATURE_VERSION=$S3_SIGNATURE_VERSION \
    S3_BUCKET=$S3_BUCKET \
    S3_BASE_URL=$S3_BASE_URL

# Expose the port
EXPOSE ${PORT}

# Start the application
CMD ["node", "dist/main"]
