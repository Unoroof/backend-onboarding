module.exports = (error) => {
  console.log("Ready for consumption", typeof error, error);

  if (typeof error === "object") {
    throw new Error(
      JSON.stringify({
        message: error.message,
        code: error.code,
      })
    );
  }

  throw new Error(
    JSON.stringify({
      message: error.message,
      code: 500,
    })
  );
};
