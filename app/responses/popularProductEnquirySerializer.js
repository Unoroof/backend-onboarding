module.exports = (instance) => {
  const attributes = [
    "uuid",
    "user_uuid",
    "product_uuid",
    "product_name",
    "name",
    "company_name",
    "mobile_number",
    "requirement_description",
  ];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
