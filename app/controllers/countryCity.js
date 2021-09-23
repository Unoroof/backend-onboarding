const { Country, City } = require("country-state-city");

module.exports = {
  async getAllCountries(req, res) {
    const countries = Country.getAllCountries();
    return countries;
  },

  async getCitybyCountryCode(req, res) {
    const countryCode = req.params.countryCode;
    return countryCode ? City.getCitiesOfCountry(countryCode) : [];
  },
};
