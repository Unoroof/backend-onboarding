const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const reformatIntoArray = (data) => {
  return Object.keys(data).map((key) => {
    return data[key][0];
  });
};

module.exports = (data, key) => {
  const groupedObject = groupBy(data, key);
  const formatedArray = reformatIntoArray(groupedObject);

  return formatedArray;
};
