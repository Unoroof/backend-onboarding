// update or merge array
module.exports = function updateOrMerge(a1, a2) {
  const ob1 = convertToKeyValueDict(a1);
  const ob2 = convertToKeyValueDict(a2);

  // Note: Spread operator with objects used here
  const merged_obj = { ...ob1, ...ob2 };
  const val = Object.entries(merged_obj);
  return val.map((obj) => ({ invoice_url: obj[0], payment_status: obj[1] }));
};

const convertToKeyValueDict = (arrayObj) => {
  const val = {};
  arrayObj.forEach((ob) => {
    val[ob.invoice_url] = ob.payment_status;
  });
  return val;
};
