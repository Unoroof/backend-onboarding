module.exports = (profiles) => {
  let finalResult = [];
  const result = profiles.reduce(function (empObj, item) {
    empObj[item.data.company_name] = empObj[item.data.company_name] || [];
    empObj[item.data.company_name].push(item.uuid); // need only profile uuids
    return empObj;
  }, Object.create(null));

  profiles.map((item) => {
    if (finalResult.length > 0) {
      let isFound = finalResult.find(
        (element) => element.company_name === item.data.company_name
      );

      if (!isFound) {
        finalResult.push({
          company_name: item.data.company_name,
          profiles: result[item.data.company_name],
        });
      }
    } else {
      finalResult.push({
        company_name: item.data.company_name,
        profiles: result[item.data.company_name],
      });
    }
  });

  return finalResult;
};
