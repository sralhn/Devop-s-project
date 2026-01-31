FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Initialize database and start server
CMD npx prisma db push --force-reset --accept-data-loss && npm start
