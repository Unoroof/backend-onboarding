const { Op } = require("sequelize");
module.exports = (query) => {
  /*  getSearchQuery is a function created to get the where object 
        with the filter by LIKE clause for email/mobile/name search
        and only including contacts of a particular user uuid 
    
    */
  let searchItem = query.search;

  console.log("gm-products searchItems:", searchItem);

  const productNames = query?.product_names
    ?.split(",")
    ?.map((productName) => productName);
  const brands = query?.brands?.split(",")?.map((brand) => brand);
  const cities = query?.cities?.split(",")?.map((city) => city);
  const country = query?.country;

  console.log("gm-products names in filterItems:", productNames);
  console.log("gm-products brands in filterItems:", brands);
  console.log("gm-products country in filterItems:", country);
  console.log("gm-products delivery cities in filterItems:", cities);

  let queries = [];
  if (searchItem) {
    queries = [
      { name: { [Op.like]: `%${searchItem}%` } },
      { data: { company: { [Op.like]: `%${searchItem}%` } } },
    ];
  } else if (productNames?.length && !productNames?.includes("")) {
    if (brands?.length && !brands?.includes("")) {
      if (country) {
        if (cities?.length && !cities?.includes("")) {
          console.log("product names, brands with country and cities");
          queries = [
            {
              [Op.and]: [
                { name: { [Op.in]: productNames ? productNames : [] } },
                { data: { brand: { [Op.in]: brands ? brands : [] } } },
                { data: { country: country } },
                { data: { city: { [Op.in]: cities ? cities : [] } } },
              ],
            },
          ];
        } else {
          console.log("product names, brands with country");
          queries = [
            {
              [Op.and]: [
                { name: { [Op.in]: productNames ? productNames : [] } },
                { data: { brand: { [Op.in]: brands ? brands : [] } } },
                { data: { country: country } },
              ],
            },
          ];
        }
      } else {
        console.log("product names with brands");
        queries = [
          {
            [Op.and]: [
              { name: { [Op.in]: productNames ? productNames : [] } },
              { data: { brand: { [Op.in]: brands ? brands : [] } } },
            ],
          },
        ];
      }
    } else if (country) {
      if (cities?.length && !cities?.includes("")) {
        console.log("product names with country and cities");
        queries = [
          {
            [Op.and]: [
              { name: { [Op.in]: productNames ? productNames : [] } },
              { data: { country: country } },
              { data: { city: { [Op.in]: cities ? cities : [] } } },
            ],
          },
        ];
      } else {
        console.log("product names with country");
        queries = [
          {
            [Op.and]: [
              { name: { [Op.in]: productNames ? productNames : [] } },
              { data: { country: country } },
            ],
          },
        ];
      }
    } else {
      console.log("product names only");
      queries = [{ name: { [Op.in]: productNames ? productNames : [] } }];
    }
  } else if (brands?.length && !brands?.includes("")) {
    if (country) {
      if (cities?.length && !cities?.includes("")) {
        console.log("brands with country and cities");
        queries = [
          {
            [Op.and]: [
              { data: { brand: { [Op.in]: brands ? brands : [] } } },
              { data: { country: country } },
              { data: { city: { [Op.in]: cities ? cities : [] } } },
            ],
          },
        ];
      } else {
        console.log("brands with country");
        queries = [
          {
            [Op.and]: [
              { data: { brand: { [Op.in]: brands ? brands : [] } } },
              { data: { country: country } },
            ],
          },
        ];
      }
    } else {
      console.log("brands only");
      queries = [{ data: { brand: { [Op.in]: brands ? brands : [] } } }];
    }
  } else if (country) {
    if (cities?.length && !cities?.includes("")) {
      console.log("country with cities");
      queries = [
        {
          [Op.and]: [
            { data: { country: country } },
            { data: { city: { [Op.in]: cities ? cities : [] } } },
          ],
        },
      ];
    } else {
      console.log("country only");
      queries = [{ data: { country: country } }];
    }
  }

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
