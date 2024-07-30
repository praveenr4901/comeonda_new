# Use a Node.js base image for the build stage
FROM node:20.11.1 as build

# Set the working directory in the container
WORKDIR /app

# Copy the application code to the working directory
COPY . /app

# Install dependencies
RUN npm install

RUN npm run build

# Use a smaller Node.js base image for the runtime stage
FROM node:20.11.1-alpine as main

# Set the working directory in the container
WORKDIR /app

# Copy the application code and dependencies from the build stage
COPY --from=build /app /app

# Expose the port the application will run on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
