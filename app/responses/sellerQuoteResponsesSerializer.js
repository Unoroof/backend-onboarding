module.exports = (instance) => {
  const attributes = ["totalItems", "response", "totalPages", "currentPage"];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
