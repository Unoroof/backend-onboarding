var axios = require("axios");

module.exports = (token,uuid = "") => {
  return new Promise((resolve, reject) => {
    var config = {
      method: "get",
      url: `${process.env.ENDPOINT}/backend-files/show/${uuid}`,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("errr", error);
        reject(error);
      });
  });
};
