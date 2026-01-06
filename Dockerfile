# # 1. Choose Node runtime
# FROM node:18

# # 2. Set working directory
# WORKDIR /app

# # 3. Copy package.json first (cache-friendly)
# COPY package*.json ./

# # 4. Install dependencies
# RUN npm install

# # 5. Copy rest of project
# COPY . .

# # OPTIONAL: load .env inside container
# # If you prefer not to copy secrets, remove this line
# COPY .env .env

# # 6. Expose your port
# EXPOSE 4500

# # 7. Run the server
# CMD ["node", "index.js"]


FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create photos directory and ensure proper permissions
RUN mkdir -p /app/photos && chmod 777 /app/photos

EXPOSE 4949  
CMD ["node", "index.js"]

