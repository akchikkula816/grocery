FROM node:18

WORKDIR /app

# Copy package.json first to leverage caching
COPY package*.json ./

# Rebuild native modules (like sqlite3) inside the container
RUN npm install --build-from-source --production

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 80

# Start app
CMD ["node", "server.js"]
