# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for layer caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (Render sets PORT env, this is informational)
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]