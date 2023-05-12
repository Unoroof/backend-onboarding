module.exports = (instance) => {
  const attributes = [
    "uuid",
    "name",
    "profile_uuid",
    "brand_name",
    "price",
    "max_price",
    "discount",
    "data",
    "status",
    "gmCategories",
    "product_data",
    "company_data",
    "sellers_products",
    "company_products",
    "keyword",
    "profile_data",
  ];
  const result = {};
  for (const attribute of attributes) {
    console.log("called->>>>>");
    result[attribute] = instance[attribute];

    if (
      attribute === "profile_data" &&
      instance[attribute] &&
      Object.keys(instance[attribute]).length
    ) {
      const requiredProfileData = {
        company_name: instance[attribute].company_name,
        full_name: instance[attribute].full_name,
        city: instance[attribute].city,
        country: instance[attribute].country,
      };

      result[attribute] = requiredProfileData;
    }
  }

  return result;
};
