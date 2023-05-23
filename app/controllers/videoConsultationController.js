const consumeError = require("../functions/consumeError");
const models = require("../models");
const { Op, Sequelize } = require("sequelize");

const Profile = models.Profile;
const Category = models.Category;
const Product = models.Product;
const VideoConsultation = models.VideoConsultation;

const { generateAuthToken, createRoom } = require("../functions/100ms");

module.exports = {
  async getAuthToken(req, res) {
    try {
      const requestId = req.params.requestId;

      const videoConsultationRequest = await VideoConsultation.findByPk(
        requestId
      );

      if (!videoConsultationRequest) {
        throw new Error("Request not found");
      }

      const profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      const role =
        videoConsultationRequest.destination === profile.uuid
          ? "presenter"
          : "participator";

      const token = await generateAuthToken(req.user, requestId, role);

      return { token };
    } catch (error) {
      consumeError(error);
    }
  },

  async createRoom(req, res) {
    try {
      const requestId = req.params.requestId;

      const profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      const roomResponse = await createRoom(requestId);

      return true;
    } catch (error) {
      consumeError(error);
    }
  },

  async searchAllSuggestions(req, res) {
    try {
      console.log("req000", req.body);

      const categoryList = await Category.findAll({
        attributes: [Sequelize.fn("DISTINCT", Sequelize.col("name")), "name"],
        where: {
          name: { [Op.iLike]: `%${req.body.searchText}%` },
        },
      });

      const categorySuggestions = categoryList.map((category) => {
        return {
          name: category.name,
          type: "fm_category",
        };
      });

      const productList = await Product.findAll({
        attributes: [Sequelize.fn("DISTINCT", Sequelize.col("name")), "name"],
        where: {
          name: { [Op.iLike]: `%${req.body.searchText}%` },
        },
      });

      const productSuggestions = productList.map((category) => {
        return {
          name: category.name,
          type: "fm_product",
        };
      });

      const companyList = await Profile?.findAll({
        where: {
          data: {
            '"company_name"': {
              [Op.iLike]: `%${req.body.searchText}%`,
            },
          },
          video_consultation_enabled: true,
        },
      });

      const companyNames = companyList.map(
        (profile) => profile.data.company_name
      );

      const uniqCompanyNames = [...new Set(companyNames)];

      const companySuggestions = uniqCompanyNames.map((name) => {
        return {
          name,
          type: "company",
        };
      });

      return {
        suggestions: [
          ...categorySuggestions,
          ...productSuggestions,
          ...companySuggestions,
        ],
      };
    } catch (error) {
      consumeError(error);
    }
  },
};
