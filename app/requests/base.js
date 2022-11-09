var validate = require("validate.js");
const consumeError = require("../functions/consumeError");

validate.validators.custom_callback = function (
  value,
  options,
  key,
  attributes,
  constraints
) {
  return new validate.Promise(async function (resolve, reject) {
    let result = await options["callback"].apply(null, [constraints["req"]]);

    if (result === true) {
      return resolve();
    }

    return resolve("^" + options["message"]);
  });
};

module.exports = (constraints, req, res, next) => {
  try {
    let validateJsErrors = validate
      .async(req.body, constraints, {
        req: req,
        format: "detailed",
      })
      .then(
        () => {
          next();
        },
        (validateJsErrors) => {
          var response = {
            message: `Validation failed. ${validateJsErrors.length} error(s)`,
          };
          console.log("validateJsErrors...", validateJsErrors);

          let errors = {};

          validateJsErrors.map((d) => {
            if (!errors[d.attribute]) {
              errors[d.attribute] = d.error;
            }

            return d;
          });

          response["errors"] = errors;

          return res.status(422).send(response);
        }
      );
  } catch (error) {
    consumeError(error);
  }
};
