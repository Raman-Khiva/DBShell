FROM node:24.12-alpine AS base 
WORKDIR /app 
RUN corepack enable 


FROM base as pruner 
COPY . . 
RUN pnpm dlx turbo prune web --docker 

FROM base AS installer 
WORKDIR /app 
COPY --from=pruner /app/out/json ./ 
RUN pnpm install --frozen-lockfile


FROM base as runner 
WORKDIR /app 
COPY --from=pruner /app/out/full ./ 
COPY --from=installer /app/node_modules ./node_modules 

EXPOSE 3000 

CMD ["pnpm","--filter","web","dev"]
