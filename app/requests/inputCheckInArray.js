module.exports.checkPresence = (arr, input) => {
  console.log("we are in check function", arr, input);
  const { length } = arr;
  const found = arr.some((el) => el.value === input);
  if (found) {
    console.log("condition success", found);
  } else {
    return "^" + "the value entered did not match with master list";
  }
};
