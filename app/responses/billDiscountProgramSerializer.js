module.exports = (instance) => {
  const attributes = [
    "uuid",
    "daily_bids_uuid",
    "request_by",
    "request_to",
    "invoices",
    "data",
    "status",
  ];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  return result;
};
