FROM oven/bun:1.1.17 AS builder

WORKDIR /app

# Copy package files from the current directory
COPY package.json bun.lockb ./
RUN bun install 

# Copy the rest of the frontend code
COPY . .
RUN bun run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
