var axios = require("axios");

module.exports = (token, payload) => {
  return new Promise((resolve, reject) => {
    var data = JSON.stringify(payload);

    var config = {
      method: "post",
      url: `${process.env.AUTH_ENDPOINT}/users`,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        // console.log("check here ", response);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
};
