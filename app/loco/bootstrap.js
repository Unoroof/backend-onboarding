const { executeRoute, locoFactory } = require("@locospec/engine");
const operator = require("@locospec/operator-knexjs");
const path = require("path");

module.exports = (app, indexRouter) => {
  locoFactory.init({
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
        let result = await executeRoute(mentalRoute, {
          req: req,
          reqBody: req.body,
          reqParams: req.params,
          reqQuery: req.query,
          reqHeaders: req.headers,
        });
        return res.status(200).send(result["respondResult"]);
      }
    );
  });

  return indexRouter;
};
