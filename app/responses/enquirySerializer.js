module.exports = (instance) => {
  const attributes = [
    "uuid",
    "user_uuid",
    "type",
    "data",
    "status",
    "payment_status",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
