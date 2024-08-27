# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the environment variables
COPY .env .env

# Build the React app
RUN npm run build

# Serve the React app
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 3000
