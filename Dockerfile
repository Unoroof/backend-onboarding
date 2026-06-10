FROM node:22.22.2-alpine3.22 AS deps

WORKDIR /app

# Native/build packages for optional node-gyp compiles during install only.
RUN apk add --no-cache python3 make g++ postgresql-dev

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production \
    && yarn cache clean

FROM node:22.22.2-alpine3.22 AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node . .

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

CMD ["yarn", "start"]
