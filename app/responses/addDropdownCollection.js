const addDropdownSerializer = require("./addDropdownSerializer");

module.exports = (req, res, next) => {
  try {
    let data = req.data;
    let groupedData = groupBy(data, "type");
    return groupedData;
  } catch (error) {
    console.log("addDropdownSerializer-error", error);
    throw error;
  }

  function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
};
