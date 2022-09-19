const models = require("../models");
const DropdownValues = models.DropdownValues;
const { Op } = require("sequelize");
const consumeError = require("./consumeError");

module.exports = async (param) => {
  try {
    let getDropdownValues = await DropdownValues.findAll({
      where: {
        [Op.and]: [
          { label: param.label.toLowerCase() },
          { value: param.value.toLowerCase() },
          { type: param.type.toLowerCase() },
        ],
      },
    });
    console.log("getDropdownValues*******", getDropdownValues);
    if (getDropdownValues.length == 0) {
      const dropdownValue = await DropdownValues.create({
        label: param.label.toLowerCase(),
        value: param.value.toLowerCase(),
        type: param.type.toLowerCase(),
      });
      return dropdownValue;
    }
  } catch (error) {
    consumeError(error);
  }
};
