const ProfileController = require("./profile");
const QueryController = require("./queries");
const CountryAndCityController = require("./countryCity");
const ProductCategoryController = require("./category");
const ProductController = require("./product");
const QueryResponseController = require("./queryResponses");
const AutoAssignConditionController = require("./autoAssignConditions");
const EnquiryController = require('./enquiries')

module.exports = {
  ProfileController,
  ProductController,
  CountryAndCityController,
  ProductCategoryController,
  QueryController,
  QueryResponseController,
  AutoAssignConditionController,
  EnquiryController
};
