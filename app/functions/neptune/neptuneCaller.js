var axios = require("axios");
var uuid = require("uuid");
var dayjs = require("dayjs");

module.exports = async function (payload) {
  // console.log("checkherepayloadinneptunecaller", JSON.stringify(payload));

  var data = {
    version: 1,
    message_id: process.env.NEPTUNE_ENV + "-" + uuid.v4(),
    timestamp: dayjs().unix(),
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
