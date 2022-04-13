module.exports = (instance) => {
  const attributes = [
    "uuid",
    "name",
    "profile_uuid",
    "brand_name",
    "price",
    "discount",
    "data",
    "status",
    "categories",
  ];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
