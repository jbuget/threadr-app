ARG NODE_VERSION=20-alpine3.17

FROM node:${NODE_VERSION} as base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /app

# Build
FROM base as build

COPY package.json package-lock.json ./
RUN npm install --production=false

COPY . .

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /app/.output /app/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]