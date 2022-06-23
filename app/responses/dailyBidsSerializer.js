module.exports = (instance) => {
  const attributes = ["uuid", "profile_uuid", "bids", "data"];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
