# 1. Use Node.js as the base image
FROM node:18-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Build the TypeScript code
RUN npm run build

# 7. Expose the port your NestJS app runs on (e.g., 4000)
EXPOSE 4000

# 8. Start the app (NestJS outputs to dist/main.js by default)
CMD ["node", "dist/main.js"]