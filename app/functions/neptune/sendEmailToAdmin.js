var sendEvent = require("./neptuneCaller");

module.exports = async function (data) {
  var payload = {
    event_type: data.event_type,
    user_id: data.user_id,
    data: data.data,
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
