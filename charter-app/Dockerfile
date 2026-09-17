FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite-dev || apk add --no-cache --no-scripts python3 make g++ sqlite-dev

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache python3 make g++ sqlite-dev || apk add --no-cache --no-scripts python3 make g++ sqlite-dev

COPY --from=base /app/.next /app/.next
COPY --from=base /app/public /app/public
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/package.json

RUN npm rebuild better-sqlite3

ENV NODE_ENV=production PORT=3000
EXPOSE 3000

CMD ["node", "node_modules/.bin/next", "start"]
