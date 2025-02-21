# Use official Node.js LTS image
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the Next.js development server
CMD ["npm", "run", "dev"]
