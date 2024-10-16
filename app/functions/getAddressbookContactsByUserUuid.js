var axios = require("axios");

module.exports = (token, user_uuid) => {
  console.log("getAddressBookContactsByUserUuid", user_uuid);
  return new Promise((resolve, reject) => {
    var config = {
      method: "get",
      url: `${process.env.ADDRESSBOOK_ENDPOINT}/contacts?user_uuid=${user_uuid}`,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        console.log(
          "getAddressBookContactsByUserUuidResponse",
          JSON.stringify(response.data)
        );
        resolve(response.data.data);
      })
      .catch((error) => {
        console.log(
          "getAddressBookContactsByUserUuidError",
          JSON.stringify(error)
        );
        reject(error.response.data);
      });
  });
};
