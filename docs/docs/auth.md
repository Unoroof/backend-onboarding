---
sidebar_position: 9
---

# Auth

No, we don't have an authentication mechanism. All we have is one middleware which acts a bridge to allow or disallow api calls, and puts userID in sub.

Like we mentioned, we use this codebase for writing microservices. So, we already someone handling authentication and generating an api token.

And someone calls this microservice with `Authorization: Bearer <token>`

At this point we assume that the token is jwt, so we just decode it, get the sub and proceed, so that controller or someone can do whatever they want. A microservice shouldn't be aware of too many things either!

Checkout: `app/middlewares/auth.js`

One thing we did include is a way to exclude some routes for authentication. It might be a liveness or a readiness probe (Coming soon).

Looks like we would be deploying this repo soon to our cluster to give you an idea.
