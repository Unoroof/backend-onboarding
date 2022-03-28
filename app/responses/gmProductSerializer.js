module.exports = (instance) => {
  const attributes = ["uuid", "name", "categories"];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
