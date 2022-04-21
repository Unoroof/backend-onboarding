const ProfileController = require("./profile");
const QueryController = require("./queries");
const ProductRequestController = require("./productRequest");
const CountryAndCityController = require("./countryCity");
const ProductCategoryController = require("./category");
const ProductController = require("./product");
const QueryResponseController = require("./queryResponses");
const AutoAssignConditionController = require("./autoAssignConditions");
const EnquiryController = require("./enquiries");
const GmCategoryController = require("./gmCategory");
const GmProductController = require("./gmProduct");
const QuoteController = require("./quotes");
const QuoteResponseController = require("./quoteResponses");

module.exports = {
  ProfileController,
  ProductController,
  CountryAndCityController,
  ProductCategoryController,
  QueryController,
  ProductRequestController,
  QueryResponseController,
  AutoAssignConditionController,
  EnquiryController,
  GmCategoryController,
  GmProductController,
  QuoteController,
  QuoteResponseController,
};
