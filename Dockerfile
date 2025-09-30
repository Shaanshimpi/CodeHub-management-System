# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY codehub-erp-backend/package*.json ./codehub-erp-backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN cd codehub-erp-backend && npm ci --only=production
RUN cd frontend && npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
WORKDIR /app/codehub-erp-backend
CMD ["npm", "start"]
