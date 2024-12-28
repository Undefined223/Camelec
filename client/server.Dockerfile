# Use an official Node runtime as a parent image
FROM node:20.0.0-alpine3.17

# Set the working directory
WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the app (uncomment this if your project needs a build step)
# RUN npm run build

# The command to run the app using Node.js
CMD ["npm", "start"]


# Expose the port the app runs on
EXPOSE 3404
