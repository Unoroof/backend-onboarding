module.exports = (instance) => {
  const attributes = [
    "uuid",
    "user_uuid",
    "type",
    "data",
    "status",
    "createdAt",
    "updatedAt",
  ];
  //   const associations = ["author"];// Todo - Remove these as we are not using

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  //   for (const association of associations) {
  //     if (instance[association] !== undefined) {
  //       result[association] = authorserializer(instance[association]);
  //     }
  //   }

  return result;
};
