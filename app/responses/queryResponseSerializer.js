module.exports = (instance) => {
  const attributes = [
    "uuid",
    "profile_uuid",
    "query_uuid",
    "data",
    "status",
    "query_type",
    "createdAt",
    "updatedAt",
    "owner_uuid",
    "assigned_uuid",
    "assigned_to_email",
    "assigned_to_mobile",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
