# Use official Node.js image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies separately for caching
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --frozen-lockfile || yarn install --frozen-lockfile

# Copy rest of frontend source
COPY . .

# Build Next.js app
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy build output & node_modules from base stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

# Expose Next.js port
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]
