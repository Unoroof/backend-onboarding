var axios = require("axios");

module.exports = (pincode = "", countrycode = "") => {
  return new Promise((resolve, reject) => {
    var config = {
      method: "get",
      url: `${process.env.PINCODE_CHECK_API_ENDPOINT}?postalcode=${pincode}&countrycode=${countrycode}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        console.log("PinCode response", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.log("PinCode response", JSON.stringify(error, null, 2));
        reject(error.response.data);
      });
  });
};
