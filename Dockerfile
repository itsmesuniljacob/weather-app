# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application for production
RUN npm run build

# Install a lightweight web server to serve the React application
RUN npm install -g serve

# Set the command to start the web server and serve the build output
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 3000
