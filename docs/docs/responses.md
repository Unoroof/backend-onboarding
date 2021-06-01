---
sidebar_position: 7
---

# Responses

You can return whatever you want and it will return anyway.

Just for fun we tried to put together a way to write your own serializers and control the response, basically offload that headache away from controllers (Thin controllers).

Just for reference, just try to follow through what happens here:

```js
router.get(
  "/blogs/:id",
  executeForResult(blogController.show),
  executeForResponse(blogResourceResponse)
);
```

Focus on what's inside `blogResourceResponse`
