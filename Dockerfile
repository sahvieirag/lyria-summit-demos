# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies (including devDependencies for the build)
RUN npm install

# Copy the rest of the application's code to the working directory
COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Expose the port the app runs on. Cloud Run will use the PORT env var.
EXPOSE 8080

# Start the application by running the backend server
CMD ["node", "backend/server.js"]
