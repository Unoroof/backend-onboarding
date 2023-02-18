module.exports = (instance) => {
  const attributes = [
    "uuid",
    "user_uuid",
    "type",
    "data",
    "status",
    "onboarded",
    "createdAt",
    "updatedAt",
    "company_name",
    "profiles",
    "video_consultation_enabled",
    "video_consultation_data",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
