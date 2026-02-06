FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Sync database schema and start server
# Using 'db push' instead of 'migrate deploy' to sync schema directly
# This is appropriate for development/POC environments
CMD npx prisma db push && npm start
