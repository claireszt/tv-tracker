# Use Node.js LTS Alpine image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Install required dependencies
RUN apk add --no-cache python3 g++ make

# Copy package.json and install all dependencies (including dev)
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm install 

# Remove dev dependencies to keep image small
RUN npm prune --production

# Copy all project files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
