var axios = require("axios");
var uuid = require("uuid");
var dayjs = require("dayjs");

module.exports = async function (payload) {
  var data = {
    version: 1,
    message_id: process.env.NEPTUNE_ENV + "-" + uuid.v4(),
    timestamp: dayjs().unix(),
    ignore_user_contacts: true,
    contact_infos: [
      {
        type: "email",
        value: "sonali@unoroof.in",
      },
      {
        type: "email",
        value: "manasa@betalectic.com",
        cc: true,
      },
      {
        type: "email",
        value: "rajesh@betalectic.com",
        cc: true,
      },
    ],
  };
  data = JSON.stringify({ ...data, ...payload });

  var config = {
    method: "post",
    url: `${process.env.NEPTUNE_ENDPOINT}/${process.env.NEPTUNE_ENV}/events`,
    headers: {
      Authorization: `Bearer ${process.env.NEPTUNE_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
