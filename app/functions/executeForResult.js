module.exports = (func, storeKey = "data") => {
  return async (req, res, next) => {
    try {
      console.log("fund", func);

      let result = await func.apply(null, [req, res]);
      req[storeKey] = result;
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
