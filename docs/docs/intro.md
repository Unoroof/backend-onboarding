---
sidebar_position: 1
---

# Intro

Decide if you want to use NobeJS or not.

## What is NobeJS?

NobeJS is not yet another NodeJS framework, Please relax.

It's just a starter kit to develop APIs and not even Typescript based. Ouch, Imagine our laziness.

The way to use it is ...simple! **Clone it**

```shell
git clone git@github.com:betalectic/nobejs.git
```

It definitely doesn't solve many use cases, it's generic. But the way we deploy this is, making a docker image and deploying it into a Kubernetes Cluster.

## What problem it solves for us?

As we have been building projects over an year using NodeJS, we really liked it. We like it as it is, just Node + Express.

But then, if we are instantiating a new repo every week, we felt, we are doing too much copy pasting, and need one repo which we can clone and get started.

The framework which we were used to was Laravel. We wanted our NodeJS folder structure and some bit of ecosystem around it.

As part of typical Node + Postgres API Codebase, we use following libraries:

- ExpressJS
  - Middlewares
  - Routing
- Sequelize
  - For Migrations
  - For Models, Queries
- ValidateJS
