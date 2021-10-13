const { Op } = require("sequelize");
module.exports = (searchItem, user_uuid) => {
  /*  getSearchQuery is a function created to get the where object 
        with the filter by LIKE clause for email/mobile/name search
        and only including contacts of a particular user uuid 
    
    */
  console.log("searchItem:", searchItem);
  let queries = searchItem
    ? [
        // { : { [Op.like]: `%${searchItem}%` } },
        { name: { [Op.like]: `%${searchItem}%` } },
        // { : { [Op.like]: `%${searchItem}%` } },
      ]
    : [];

  const whereOptions = queries.length
    ? {
        where: {
        //   user_uuid: user_uuid,
          [Op.or]: queries,
        },
      }
    : {
        where: {
        //   user_uuid: user_uuid,
        },
      };
  return whereOptions;
};
