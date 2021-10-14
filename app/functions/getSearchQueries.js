const { Op } = require("sequelize");
module.exports = (searchItem) => {
  /*  getSearchQuery is a function created to get the where object 
        with the filter by LIKE clause for email/mobile/name search
        and only including contacts of a particular user uuid 
    
    */
  console.log("searchItem:", searchItem);
  let queries = searchItem ? [{ name: { [Op.like]: `%${searchItem}%` } }] : [];

  const whereOptions = queries.length
    ? {
        where: {
          [Op.or]: queries,
        },
      }
    : {
        where: {},
      };
  return whereOptions;
};
