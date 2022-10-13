module.exports = (instance) => {
  const attributes = ["sort_by"];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
