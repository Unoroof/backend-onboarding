module.exports = (instance) => {
  const attributes = [
    "uuid",
    "name",
    "company_name",
    "mobile_number",
    "email",
    "createdAt",
    "updatedAt",
  ];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
