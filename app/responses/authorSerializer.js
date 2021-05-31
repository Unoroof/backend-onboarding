module.exports = (instance) => {
  const attributes = ["id", "name"];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
