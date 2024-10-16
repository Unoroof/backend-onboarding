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
const GmBulkProductController = require("./gmBulkProduct");
const QuoteController = require("./quotes");
const QuoteResponseController = require("./quoteResponses");
const AddressController = require("./address");
const BDSuppliersController = require("./billDiscountSuppliers");
const DailyBidsController = require("./dailyBids");
const BillDiscountProgramController = require("./billDiscountProgram");
const ContactUsLeadsController = require("./contactUsLeads");
const OnboardingModuleDropdownsController = require("./onboardingModuleDropdowns");
const PopularProductEnquiryController = require("./popularProductEnquiry");
const SearchFilterGmProductsController = require("./searchFilterGmProducts");
const GetGmSellerProductsController = require("./getGmSellerProducts");
const CreateNewGmCategoryRequestController = require("./gmCategoryRequests");
const VideoConsultationController = require("./videoConsultationController");

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
  GmBulkProductController,
  QuoteController,
  QuoteResponseController,
  AddressController,
  BDSuppliersController,
  DailyBidsController,
  BillDiscountProgramController,
  ContactUsLeadsController,
  OnboardingModuleDropdownsController,
  PopularProductEnquiryController,
  SearchFilterGmProductsController,
  GetGmSellerProductsController,
  CreateNewGmCategoryRequestController,
  VideoConsultationController,
};
