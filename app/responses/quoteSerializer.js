module.exports = (instance) => {
  const attributes = [
    "uuid",
    "profile_uuid",
    "seller_uuid",
    "data",
    "status",
    "createdAt",
    "updatedAt",
    "totalItems",
    "response",
    "totalPages",
    "currentPage",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
