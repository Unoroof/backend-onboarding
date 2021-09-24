module.exports = (instance) => {
  const attributes = [
    "uuid",
    "profile_uuid",
    "type",
    "data",
    "status",
    "createdAt",
    "updatedAt",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
