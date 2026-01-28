# Use Node.js environment
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the Vite port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev", "--", "--host"]