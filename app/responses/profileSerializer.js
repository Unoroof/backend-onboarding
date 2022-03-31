module.exports = (instance) => {
  const attributes = [
    "uuid",
    "user_uuid",
    "type",
    "data",
    "status",
    "onboarded",
    "createdAt",
    "updatedAt",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
