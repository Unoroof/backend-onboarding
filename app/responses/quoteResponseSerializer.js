module.exports = (instance) => {
  const attributes = [
    "uuid",
    "buyer_uuid",
    "quote_uuid",
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
