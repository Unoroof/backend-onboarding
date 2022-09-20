module.exports = (instance) => {
  const attributes = [
    "uuid",
    "label",
    "value",
    "type",
    "createdAt",
    "updatedAt",
  ];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
