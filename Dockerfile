FROM node:18

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies inside container
RUN npm install --production

# Copy rest of the code
COPY . .

# Expose port 80
EXPOSE 80

CMD ["node", "server.js"]
