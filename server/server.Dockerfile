# Use an official Node runtime as a parent image
FROM node:18.17.0-alpine AS build

# Set the working directory
WORKDIR /server

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .


# Expose the port the server runs on
EXPOSE 3404

# The command to run the app using Node.js
CMD ["node", "server.js"]

