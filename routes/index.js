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
const createCategory = require("../app/requests/createCategory");
const productCategoryCollectionResponse = require("../app/responses/categoryCollection");
const productCategoryResourceResponse = require("../app/responses/categoryResource");

const productController = require("../app/controllers").ProductController;
const productResourceResponse = require("../app/responses/productResource");
const createProduct = require("../app/requests/createProduct");
const productCollectionResponse = require("../app/responses/productCollection");

const QueryController = require("../app/controllers").QueryController;
const ProductRequestController =
  require("../app/controllers").ProductRequestController;
const createQueryRequest = require("../app/requests/createQuery");
const createProductRequest = require("../app/requests/createProductRequest");
const queryResourceResponse = require("../app/responses/queryResources");
const productRequestResourceResponse = require("../app/responses/productRequestResource");
const productRequestCollectionResponse = require("../app/responses/productRequestCollection");
const queryCollectionResponse = require("../app/responses/queryCollection");

const ResponseController =
  require("../app/controllers").QueryResponseController;
const responseCollectionResponse = require("../app/responses/queryResponseCollection");
const responseResourceResponse = require("../app/responses/queryResponseResources");

const AutoAssignConditionController =
  require("../app/controllers").AutoAssignConditionController;
const createAutoAssignConditionRequest = require("../app/requests/createAutoAssignCondition");
const AutoAssignConditionCollectionResponse = require("../app/responses/autoAssignConditionsCollection");
const AutoAssignConditionResourceResponse = require("../app/responses/autoAssignConditionResources");

const EnquiryController = require("../app/controllers").EnquiryController;
const createEnquiryRequest = require("../app/requests/createEnquiries");
const enquiryResourceResponse = require("../app/responses/enquiryResource");

const GmCategoryController = require("../app/controllers").GmCategoryController;
const createGmCategoryRequest = require("../app/requests/createGmCategory");
const gmCategoryCollectionResponse = require("../app/responses/gmCategoryCollection");
const gmCategoryResourceResponse = require("../app/responses/gmCategoryResource");

const GmProductController = require("../app/controllers").GmProductController;
const createGmProductRequest = require("../app/requests/createGmProduct");
const gmProductCollectionResponse = require("../app/responses/gmProductCollection");
const gmProductResourceResponse = require("../app/responses/gmProductResource");
const createQuote = require("../app/requests/createQuote");
const QuoteController = require("../app/controllers").QuoteController;
const QuoteResponse = require("../app/responses/quoteResources");
const QuoteCollection = require("../app/responses/quoteCollection");

const AddressController = require("../app/controllers").AddressController;
const AddressResponse = require("../app/responses/addressResource");
const AddressCollection = require("../app/responses/addressCollection");
const createAddress = require("../app/requests/createAddress");

const QuoteResponseController =
  require("../app/controllers").QuoteResponseController;
const QuoteResponseResponse = require("../app/responses/quoteResponseResources");
const QuoteResponseCollection = require("../app/responses/quoteResponseCollection");
const SellerQuoteResponsesCollection = require("../app/responses/sellerQuoteResponsesCollection");

const BDSuppliersController =
  require("../app/controllers").BDSuppliersController;
const BDSuppliersCollectionResponse = require("../app/responses/billDiscountSupplierCollection");
const BDSuppliersResourceResponse = require("../app/responses/billDiscountSupplierResource");

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

router.get(
  "/profile/:profile_uuid",
  executeForResult(profileController.showById, "profileList"),
  executeForResponse(profileCollectionResponse)
);

router.post(
  "/profiles",
  createProfileRequest,
  executeForResult(profileController.storeOrUpdate),
  executeForResponse(profileResourceResponse)
);

router.post(
  "/all-profiles",
  executeForResult(profileController.getAllProfiles, "profileList"),
  executeForResponse(profileCollectionResponse)
);

router.get(
  "/buyer-profiles",
  executeForResult(profileController.getBuyerForProduct, "profileList"),
  executeForResponse(profileCollectionResponse)
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
  createCategory,
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

router.get(
  "/product-request",
  executeForResult(ProductRequestController.getAll),
  executeForResponse(productRequestCollectionResponse)
);

router.post(
  "/product-request",
  createProductRequest,
  executeForResult(ProductRequestController.create),
  executeForResponse(productRequestResourceResponse)
);

router.put(
  "/product-request/:product_request_uuid",
  executeForResult(ProductRequestController.update),
  executeForResponse(productRequestResourceResponse)
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

router.get(
  "/all-queries",
  executeForResult(QueryController.getAll, "queries"),
  executeForResponse(queryCollectionResponse)
);

router.get(
  "/response",
  executeForResult(ResponseController.index, "queryResponse"),
  executeForResponse(responseCollectionResponse)
);
router.put(
  "/response/:response_uuid/quote",
  executeForResult(ResponseController.update),
  executeForResponse(responseResourceResponse)
);
router.post(
  "/auto-assign-conditions",
  createAutoAssignConditionRequest,
  executeForResult(AutoAssignConditionController.create),
  executeForResponse(AutoAssignConditionResourceResponse)
);
router.get(
  "/auto-assign-conditions",
  executeForResult(AutoAssignConditionController.index, "autoAssignCondition"),
  executeForResponse(AutoAssignConditionCollectionResponse)
);
router.put(
  "/auto-assign-conditions/:criteria_uuid",
  executeForResult(AutoAssignConditionController.update),
  executeForResponse(AutoAssignConditionResourceResponse)
);
router.delete(
  "/auto-assign-conditions/:criteria_uuid",
  executeForResult(AutoAssignConditionController.delete),
  executeForResponse(AutoAssignConditionResourceResponse)
);
router.post(
  "/auto-reject",
  executeForResult(ResponseController.autoReject),
  executeForResponse(responseResourceResponse)
);
router.post(
  "/re-assign",
  executeForResult(ResponseController.reAssign),
  executeForResponse(responseResourceResponse)
);
router.get(
  "/get-unassigned-responses",
  executeForResult(ResponseController.unassigned, "queryResponse"),
  executeForResponse(responseCollectionResponse)
);

router.post(
  "/enquiries",
  createEnquiryRequest,
  executeForResult(EnquiryController.create),
  executeForResponse(enquiryResourceResponse)
);
router.put(
  "/enquiries/:enquiry_uuid",
  executeForResult(EnquiryController.update),
  executeForResponse(enquiryResourceResponse)
);

// global market products

router.post(
  "/gm-categories",
  createGmCategoryRequest,
  executeForResult(GmCategoryController.store),
  executeForResponse(gmCategoryResourceResponse)
);

router.get(
  "/gm-categories",
  executeForResult(GmCategoryController.index),
  executeForResponse(gmCategoryCollectionResponse)
);

router.post(
  "/gm-products",
  createGmProductRequest,
  executeForResult(GmProductController.store),
  executeForResponse(gmProductResourceResponse)
);

router.put(
  "/gm-products/:gm_product_uuid",
  executeForResult(GmProductController.update),
  executeForResponse(gmProductResourceResponse)
);

router.get(
  "/gm-products/:gm_product_uuid",
  executeForResult(GmProductController.getProductById),
  executeForResponse(gmProductResourceResponse)
);

router.get(
  "/gm-products",
  executeForResult(GmProductController.index),
  executeForResponse(gmProductCollectionResponse)
);

router.get(
  "/search-gm-products",
  executeForResult(GmProductController.getSearchProducts),
  executeForResponse(gmProductCollectionResponse)
);

router.post(
  "/gm-products/brand-names",
  executeForResult(GmProductController.getBrandNamesForProduct),
  executeForResponse(gmProductCollectionResponse)
);

router.post(
  "/gm-products/filter-products",
  executeForResult(GmProductController.getFilteredProducts),
  executeForResponse(gmProductCollectionResponse)
);

router.post(
  "/quotes",
  createQuote,
  executeForResult(QuoteController.create),
  executeForResponse(QuoteResponse)
);

router.get(
  "/quotes",
  executeForResult(QuoteController.index, "quotes"),
  executeForResponse(QuoteCollection)
);

router.post(
  "/address",
  createAddress,
  executeForResult(AddressController.create),
  executeForResponse(AddressResponse)
);

router.put(
  "/address/:uuid",
  executeForResult(AddressController.update),
  executeForResponse(AddressResponse)
);

router.get(
  "/address",
  executeForResult(AddressController.index, "address"),
  executeForResponse(AddressCollection)
);

router.delete(
  "/address/:uuid",
  executeForResult(AddressController.delete),
  executeForResponse(AddressResponse)
);

router.put(
  "/quotes/:quote_uuid",
  createQuote,
  executeForResult(QuoteController.update),
  executeForResponse(QuoteResponse)
);

router.get(
  "/quote-response",
  executeForResult(QuoteResponseController.index, "quoteResponse"),
  executeForResponse(QuoteResponseCollection)
);

router.put(
  "/quote-response/:uuid",
  executeForResult(QuoteResponseController.update),
  executeForResponse(QuoteResponseResponse)
);

router.get(
  "/seller-quotes",
  executeForResult(
    QuoteResponseController.getBuyerQuotesToSeller,
    "sellerQuoteResponses"
  ),
  executeForResponse(SellerQuoteResponsesCollection)
);

router.post(
  "/bill-discount-supplier/invite",
  executeForResult(BDSuppliersController.create),
  executeForResponse(BDSuppliersResourceResponse)
);

router.put(
  "/bill-discount-supplier/:bd_supplier_uuid",
  executeForResult(BDSuppliersController.update),
  executeForResponse(BDSuppliersResourceResponse)
);

router.get(
  "/bill-discount-supplier/:bd_supplier_uuid",
  executeForResult(BDSuppliersController.index),
  executeForResponse(BDSuppliersResourceResponse)
);

router.get(
  "/bill-discount-supplier",
  executeForResult(BDSuppliersController.getAll, "data"),
  executeForResponse(BDSuppliersCollectionResponse)
);

// BDSuppliersCollectionResponse
module.exports = router;
