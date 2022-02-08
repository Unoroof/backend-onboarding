var sendEvent = require("./neptuneCaller");

module.exports = async function () {
  var payload = {
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

  await sendEvent(payload);
};
