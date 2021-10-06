var axios = require("axios");

module.exports = (token) => {
  return new Promise((resolve, reject) => {
    var config = {
      method: "get",
      url: `${process.env.ADDRESSBOOK_ENDPOINT}/contacts`,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
};
