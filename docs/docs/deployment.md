---
sidebar_position: 8
---

# Deployment

### Build and Run Docker Image

Though to run in local you can run `npm run dev`, as part of docker build we are running `npm run start`

And npm run sets NODE_ENV=production

If you check: `bin/www`, you would find the following:

```
if (process.env.NODE_ENV === "development") {
  var dotenv = require("dotenv");
  dotenv.config({ path: ".env" });
}
```

> The above piece of suggests that if NODE_ENV=production, .env file won't be loaded. And .env is part of .dockerignore so that file won't be available. We didn't this so that you can pass end much easily.

Following commands should be helpful in understanding how to build and run the docker image:

```
docker build -t nobejs:latest .
```

You would be replacing nobejs with something more meaningful to you. Once the docker image is built, you run it.

```
docker run -d -p 3000:3000 --env-file ./env.list nobejs:latest
```

In root folder you will have a called `env.list` which supplies ENV variables to your container. Basically this way, .env is not part of your image, this way if you are building any microservices based on nodejs and open sourcing it for others to use, then needn't build the docker image, they can just run passing env variables via command line

--

We will add kube manifests very soon.
