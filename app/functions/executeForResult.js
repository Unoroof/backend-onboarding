module.exports = (func, resultKey = "data") => {
  return async (req, res, next) => {
    try {
      let result = await func.apply(null, [req, res]);
      req[resultKey] = result;
      next();
    } catch (error) {
      next(error);
      // throw new Error(
      //   JSON.stringify({
      //     message: JSON.parse(error.message).message,
      //     code: JSON.parse(error.message).code,
      //   })
      // );
    }
  };
};
