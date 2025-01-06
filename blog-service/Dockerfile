FROM node:16-alpine AS builder
WORKDIR /app
# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]