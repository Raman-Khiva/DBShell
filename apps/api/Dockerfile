
#FROM node:24.14-slim
#WORKDIR /app
#
#RUN corepack enable 
#
#COPY . .
#
#RUN pnpm install --frozen-lockfile
#
#RUN pnpm --filter api... build
#
#EXPOSE 5000
#
#CMD ["pnpm", "--filter", "api", "start"]


FROM node:24.14-alpine AS base 
WORKDIR /app 
RUN corepack enable 

FROM base AS pruner 
COPY . .
RUN pnpm dlx turbo prune api --docker 


FROM base as installer 
WORKDIR /app 
COPY --from=pruner /app/out/json ./ 
RUN pnpm install --frozen-lockfile


FROM base as runner 
WORKDIR /app 
COPY --from=pruner /app/out/full ./ 
COPY --FROM=installer /app/node_modules ./node_modules 

EXPOSE 5000 

CMD ["pnpm","--filter","api","dev"]



