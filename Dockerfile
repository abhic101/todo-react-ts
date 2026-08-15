#STAGE 1: Installing deps
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json .

RUN npm ci

#STAGE 2: Building
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

#STAGE 3: Server
FROM nginx:latest AS server
WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]