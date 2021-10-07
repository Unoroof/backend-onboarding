module.exports = (instance) => {
  const attributes = [
    "uuid",
    "profile_uuid",
    "matching_criteria",
    "assign_to",
    "createdAt",
    "updatedAt",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
