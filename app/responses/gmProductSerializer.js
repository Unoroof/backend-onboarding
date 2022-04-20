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
    "gmCategories",
    "seller_data",
    "product_data",
    "company_data",
    "sellers_products",
    "company_products",
    "keyword",
  ];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
