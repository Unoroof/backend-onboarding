module.exports = (instance) => {
  const attributes = ["uuid", "name"];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
