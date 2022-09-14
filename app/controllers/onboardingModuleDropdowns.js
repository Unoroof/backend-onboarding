const models = require("../models");
const DropdownValues = models.DropdownValues;
const { Op } = require("sequelize");
const consumeError = require("../functions/consumeError");

module.exports = {
  async create(req, res) {
    try {
      let getDropdownValues = await DropdownValues.findAll({
        where: {
          [Op.and]: [
            { label: req.body.label.toLowerCase() },
            { value: req.body.value.toLowerCase() },
            { type: req.body.type.toLowerCase() },
          ],
        },
      });
      console.log("getDropdownValues*******", getDropdownValues);
      if (getDropdownValues.length == 0) {
        const dropdownValue = await DropdownValues.create({
          label: req.body.label.toLowerCase(),
          value: req.body.value.toLowerCase(),
          type: req.body.type.toLowerCase(),
        });
        return dropdownValue;
      }
    } catch (error) {
      consumeError(error);
    }
  },

  async getDropdown(req, res) {
    try {
      let where = {};
      let types = req.query.type.split(",").map((item) => {
        return item;
      });

      if (req.query.type) {
        where = {
          type: {
            [Op.in]: req.query.type ? types : [],
          },
        };
      }
      let getDropdownValues = await DropdownValues.findAll({
        raw: true,
        where: {
          ...where,
        },
      });

      getDropdownValues.map((item) => {
        let labelCapitalize =
          item.label[0].toUpperCase() + item.label.substring(1);
        let valueCapitalize =
          item.value[0].toUpperCase() + item.value.substring(1);
        item.label = labelCapitalize;
        item.value = valueCapitalize;

        return item.type;
      });

      return getDropdownValues;
    } catch (error) {
      console.log("error123", error);
      consumeError(error);
    }
  },
};
