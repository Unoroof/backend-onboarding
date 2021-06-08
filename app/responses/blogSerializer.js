const authorSerializer = require("./authorSerializer");

module.exports = (instance) => {
  const attributes = ["id", "title", "excerpt", "content"];
  const associations = ["author"];

  const result = {};

  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }

  for (const association of associations) {
    if (instance[association] !== undefined) {
      result[association] = authorSerializer(instance[association]);
    }
  }

  return result;
};
