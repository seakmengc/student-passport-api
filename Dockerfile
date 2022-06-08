ARG NODE_IMAGE=node:16.13.2-alpine

FROM $NODE_IMAGE AS builder

ENV NODE_ENV=dev

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# remove development dependencies
RUN npm prune --production

FROM $NODE_IMAGE

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app ./

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \ 
    CMD node ./dist/healthcheck.js

CMD [ "yarn", "start:prod" ]