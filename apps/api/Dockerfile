FROM node:24.14-slim

WORKDIR /app

RUN corepack enable 

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter api... build

EXPOSE 5000

CMD ["pnpm", "--filter", "api", "start"]

