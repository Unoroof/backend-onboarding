---
sidebar_position: 2
---

# Install

It a nodejs repo with already some code which helps you start:

### Get the codebase

```shell
git clone git@github.com:betalectic/nobejs.git
```

### Install node modules

We suggest once you clone, you just run:

```shell
npm install
```

| You can use yarn too!

### Setup .env

Copy .env.example to .env and fill it with values

### Migrate database

```shell
npm run migrate
```

### Run the app

You can just run `npm run dev` and the app starts at port 3000

### Open postman and take it for a ride

Make an api call to `http://localhost:3000/blogs`

You would get an empty array as response.
