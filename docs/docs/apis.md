---
sidebar_position: 5
---

# APIs

We used express router, and we will explain it using the following example:

```js
router.get(
  "/blogs",
  executeForResult(blogController.index, "blogList"),
  executeForResponse(blogCollectionResponse)
);
```

We have two functions (important functions, but super simple).

### executeForResult

It accepts two arguments:

- A function
- A resultKey - string (which is optional and defaults to "data")

executeForResult simply calls the function you provided with args req, res and puts result in resultKey

To give an idea, look at func: `blogController.index`

```js
async index(req, res) {
    try {
        let blogs = await Blog.findAll();
        return blogs;
    } catch (error) {
        consumeError(error);
    }
},
```

index function got two arguments req and res, which are automatically (not magically) passed by executeForResult. Whatever index sent as result, it's in `req["blogList"]`

Checkout `app/functions/executeForResult.js`

### executeForResponse

This function does exactly the same, but it doesn't store result in any key, it just returns a response with 200 status or throws an error.

Checkout `app/functions/executeForResponse.js`

Does it feel like you are almost there and you will be writing your own framework soon?
