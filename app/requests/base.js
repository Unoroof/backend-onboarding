var validate = require("validate.js");

module.exports = (constraints, req, res, next) => {
  let validateJsErrors = validate(req.body, constraints, {
    format: "detailed",
  });

  if (validateJsErrors === undefined) {
    next();
  } else {
    var response = {
      message: `Validation failed. ${validateJsErrors.length} error(s)`,
    };

    let errors = {};

    validateJsErrors.map((d) => {
      errors[d.attribute] = d.error;
      return d;
    });

    response["errors"] = errors;

    return res.status(422).send(response);
  }
};
