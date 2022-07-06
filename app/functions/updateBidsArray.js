// update or merge array
module.exports = function updateOrMerge(a1, a2) {
  const ob1 = convertToKeyValueDict(a1);
  const ob2 = convertToKeyValueDict(a2);

  // Note: Spread operator with objects used here
  const merged_obj = { ...ob1, ...ob2 };
  const val = Object.entries(merged_obj);
  return val.map((obj) => ({ tenor: obj[0], discount: obj[1] }));
};

const convertToKeyValueDict = (arrayObj) => {
  const val = {};
  arrayObj.forEach((ob) => {
    val[ob.tenor] = ob.discount;
  });
  return val;
};
