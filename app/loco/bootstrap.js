const { executeRoute, locoFactory } = require("@locospec/engine");
const operator = require("@locospec/operator-knexjs");
const path = require("path");

module.exports = (app, indexRouter) => {
  locoFactory.init({
    locoPath: path.resolve("app/loco"),
    resourcesPath: path.resolve(`app/loco/resources`),
    mixinsPath: path.resolve(`app/loco/mixins`),
    hooksPath: path.resolve(`app/loco/hooks/index.js`),
    validatorsPath: path.resolve(`app/loco/validators/index.js`),
    generatorsPath: path.resolve(`app/loco/generators/index.js`),
    resolvePayloadFnPath: path.resolve(`app/loco/functions/resolvePayload.js`),
    resolveUserFnPath: path.resolve(`app/loco/functions/resolveUser.js`),
    apiPrefix: "/loco",
    operator: operator,
  });

  const routes = locoFactory.generateRoutes();

  //   console.log("routes", routes);

  routes.forEach((mentalRoute) => {
    indexRouter[mentalRoute.method](
      mentalRoute.path,
      async (req, res, next) => {
        try{
        let result = await executeRoute(mentalRoute, {
          req: req,
          reqBody: req.body,
          reqParams: req.params,
          reqQuery: req.query,
          reqHeaders: req.headers,
        });
        return res.status(200).send(result["respondResult"]);
      }catch(err){
        if (err.statusCode) {
          let statusCode = err.statusCode;
          delete err.statusCode;
          return res.status(statusCode).send(err);
        }
        if (process.env.DEBUG === "true") {
          return res.status(500).send({ message: err });
        } else {
          return res.status(500).send({ message: "Something went wrong" });
        }
      }
      }
    );
  });

  return indexRouter;
};
