var jwt_decode = require("jwt-decode");
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");

var unless = function (path, middleware) {
  return function (req, res, next) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

const exclude = ["PUT /blog/:id", "GET /blog/:id"];

module.exports = (req, res, next) => {
  let needsAuth = true;

  exclude.forEach((p) => {
    let [method, path] = p.split(" ");
    let regex = pathToRegexp(path);
    if (method == req.method && regex.exec(req.path) !== null) {
      needsAuth = false;
    }
  });

  if (needsAuth) {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const bearer = req.headers.authorization.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    let decoded = jwt_decode(req.token);
    if (!decoded.sub) {
      return res.status(403).json({ error: "Unauthorized User" });
    }
    req.user = decoded.sub;
  }

  next();
};
