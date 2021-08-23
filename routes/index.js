var express = require("express");
var router = express.Router();
var validate = require("validate.js");
var executeForResult = require("../app/functions/executeForResult");
var executeForResponse = require("../app/functions/executeForResponse");

const countryAndCityController =
  require("../app/controllers").CountryAndCityController;
const countryCollectionResponse = require("../app/responses/countryCollection");
const cityCollectionResponse = require("../app/responses/cityCollection");
const profileController = require("../app/controllers").ProfileController;
const profileCollectionResponse = require("../app/responses/profileCollection");
const profileResourceResponse = require("../app/responses/profileResource");
const createProfileRequest = require("../app/requests/createProfile");

const productCategoryController =
  require("../app/controllers").ProductCategoryController;
const createProductCategory = require("../app/requests/createProductCategory");
const productCategoryCollectionResponse = require("../app/responses/categoryCollection");
const productCategoryResourceResponse = require("../app/responses/categoryResource");

const productController = require("../app/controllers").ProductController;
const productResourceResponse = require("../app/responses/productResource");
const createProduct = require("../app/requests/createProduct");
const productCollectionResponse = require("../app/responses/productCollection");

const QueryController = require("../app/controllers").QueryController;
const createQueryRequest = require("../app/requests/createQuery");
const queryResourceResponse = require("../app/responses/queryResources");
const queryCollectionResponse = require("../app/responses/queryCollection");

router.get("/liveness", (req, res) => {
  return res.status(200).send({
    status: "ok",
  });
});

router.get(
  "/profiles",
  executeForResult(profileController.index, "profileList"),
  executeForResponse(profileCollectionResponse)
);

router.post(
  "/profiles",
  createProfileRequest,
  executeForResult(profileController.storeOrUpdate),
  executeForResponse(profileResourceResponse)
);

router.get(
  "/countries",
  executeForResult(countryAndCityController.getAllCountries, "countries"),
  executeForResponse(countryCollectionResponse)
);

router.get(
  "/countries/:countryCode/cities",
  executeForResult(countryAndCityController.getCitybyCountryCode, "cities"),
  executeForResponse(cityCollectionResponse)
);
router.post(
  "/categories",
  createProductCategory,
  executeForResult(productCategoryController.store),
  executeForResponse(productCategoryResourceResponse)
);

router.get(
  "/categories",
  executeForResult(productCategoryController.index),
  executeForResponse(productCategoryCollectionResponse)
);
router.post(
  "/products",
  createProduct,
  executeForResult(productController.store),
  executeForResponse(productResourceResponse)
);
router.get(
  "/products",
  executeForResult(productController.index),
  executeForResponse(productCollectionResponse)
);

router.post(
  "/queries",
  createQueryRequest,
  executeForResult(QueryController.create),
  executeForResponse(queryResourceResponse)
);
router.put(
  "/queries/:query_uuid/requote",
  executeForResult(QueryController.update),
  executeForResponse(queryResourceResponse)
);
router.get(
  "/queries",
  executeForResult(QueryController.index, "queries"),
  executeForResponse(queryCollectionResponse)
);

module.exports = router;
