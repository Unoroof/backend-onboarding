var axios = require("axios");

module.exports = (token, payload) => {
  return new Promise((resolve, reject) => {
    var data = JSON.stringify(payload);

    axios
      .post(`${process.env.AUTH_ENDPOINT}/users`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        data: data,
      })
      .then((response) => {
        console.log("check here ", response);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  });
};
