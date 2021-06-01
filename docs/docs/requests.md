---
sidebar_position: 6
---

# Requests

We used: `https://validatejs.org/`

We will take an example here:

```js
router.post(
  "/blogs",
  createBlogRequest,
  executeForResult(blogController.store),
  executeForResponse(blogResourceResponse)
);
```

There are many ways to run your validator, but we pass it as a middleware/function to router itself: `createBlogRequest` is the function which will do validation. If req.body is good, next immediate function would be executed, else it will return a 422.

Again we used: https://validatejs.org/

Checkout: `app/requests/createBlog.js`

```js
const validatorBase = require("./base");

const constraints = {
  title: {
    presence: {
      allowEmpty: false,
      message: "^Please enter title",
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
```

You just need to create a similar files and write your own constraints.

You can your validation library, and just customize `base.js` to format your response.

But, we suggest, pick one validation library, and master it (write custom validators) like your life depends on it.
