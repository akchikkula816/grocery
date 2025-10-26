# Use an official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (for better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy all project files into the container
COPY . .

# Expose the app port (Heroku and most environments use 3000)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
