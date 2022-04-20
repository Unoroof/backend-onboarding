const GmProduct = require("../models").GmProduct;
const Profile = require("../models").Profile;
const GmCategory = require("../models").GmCategory;
const _ = require("lodash");

module.exports = async function getCompanyProducts(where) {
  let companyProducts = [];
  let foundedProfiles = await Profile.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    where: where,
  });

  if (foundedProfiles.length > 0) {
    await Promise.all(
      foundedProfiles.map(async (profile) => {
        let profileObj = JSON.parse(JSON.stringify(profile));
        let foundedProducts = await GmProduct.findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: GmCategory,
            as: "gmCategories",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          where: { profile_uuid: profile.uuid },
        });

        await Promise.all(
          foundedProducts.map(async (product) => {
            let productObj = JSON.parse(JSON.stringify(product));
            console.log("foundedProducts", foundedProducts);

            companyProducts.push({
              ...productObj,
              profile_data: profileObj.data,
              keyword: "company",
            });
          })
        );
      })
    );
  }
  return _.uniqBy(companyProducts, "uuid");
};
