FROM node:24.14-slim

WORKDIR /app 

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./ 

RUN pnpm install


COPY . .

EXPOSE 3000

CMD ["pnpm dev"]
