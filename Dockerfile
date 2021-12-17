FROM node:12-alpine AS stage1
RUN apk add --update --no-cache postgresql-client
WORKDIR /app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn
COPY . .


FROM node:12-alpine
COPY --from=stage1 /app /app
WORKDIR /app
EXPOSE 3000
CMD [ "npm", "start" ]