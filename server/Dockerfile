# =============================================================================
# Stage 1 — Builder
# Install all dependencies (including devDependencies) and compile TypeScript
# =============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy manifests first so Docker can cache the npm install layer
COPY package*.json ./

# Install everything — devDependencies are needed here for tsc
RUN npm ci

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JavaScript
RUN npx tsc

# =============================================================================
# Stage 2 — Runner
# Copy only the compiled output and production dependencies into a clean image
# =============================================================================
FROM node:24-alpine AS runner

WORKDIR /app

# Copy manifests again so we can do a production-only install
COPY package*.json ./

# Install only production dependencies — no devDependencies
RUN npm ci --omit=dev

# Copy the compiled JS from the builder stage
COPY --from=builder /app/dist ./dist

# Change ownership of the app directory to the non-root 'node' user
RUN chown -R node:node /app

# Switch to the non-root user
USER node

EXPOSE 8080

# Run plain node against the compiled entry point
CMD ["node", "dist/index.js"]
