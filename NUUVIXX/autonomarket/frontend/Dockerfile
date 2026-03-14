FROM node:18-alpine

WORKDIR /app

# Copy package config and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
