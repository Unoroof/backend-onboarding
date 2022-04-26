module.exports = (instance) => {
  const attributes = [
    "uuid",
    "name",
    "profile_uuid",
    "location_name",
    "address",
    "country",
    "city",
    "pincode",
    "data",
    "message",
  ];
  const result = {};
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  return result;
};
