FROM node:20-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

RUN yarn install --production --frozen-lockfile && yarn cache clean

FROM node:20-alpine3.19 AS production

RUN apk update && apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

COPY --from=build /usr/src/app/tsconfig.json ./tsconfig.json

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["/bin/sh", "-c", "yarn typeorm-ts-node-commonjs migration:run -d dist/config/database/data-source.js && node dist/main.js"]