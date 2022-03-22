module.exports = (instance) => {
  const attributes = ["uuid", "name", "category", "data"];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
