module.exports = (instance) => {
  console.log("instance", instance);
  const attributes = ["uuid", "category_name", "created_by", "status"];
  const result = {
    full_name: "",
    email: "",
  };
  for (const attribute of attributes) {
    result[attribute] = instance[attribute];
  }
  if (instance.dataValues.profile_data) {
    result["full_name"] = instance.dataValues.profile_data.full_name || "";
    result["email"] = instance.dataValues.profile_data.email || "";
  }
  return result;
};
