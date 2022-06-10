module.exports = (instance) => {
  const attributes = [
    "uuid",
    "invited_by",
    "company_name",
    "profile_uuid",
    "email",
    "phone_number",
    "invoices",
    "status",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
