const consumeError = require("./consumeError");
const getAddressbookContacts = require("./getAddressbookContacts");
const getAddressbookUsersProfile = require("./getAddressbookUsersProfile");

module.exports = async (token, queryResponses) => {
  try {
    const addressbookContacts = await getAddressbookContacts(token);

    let addressbookUserProfile = await getAddressbookUsersProfile(
      token,
      addressbookContacts
    );

    console.log("check here:addressbookUserProfile:", addressbookUserProfile);
    let coreBuyerLeads = [];

    await queryResponses.map(async (response) => {
      await addressbookUserProfile.map((profile) => {
        if (response.profile_uuid === profile.uuid) {
          coreBuyerLeads.push(response);
        }
      });
    });

    console.log("check here coreBuyerLeads:", coreBuyerLeads);

    let wiredUpGeneratedLeads = await diffArray(queryResponses, coreBuyerLeads);

    console.log("check here wiredUpGeneratedLeads:", wiredUpGeneratedLeads);

    let buyers = {
      coreBuyerLeads: coreBuyerLeads,
      wiredUpGeneratedLeads: wiredUpGeneratedLeads,
    };

    return buyers;
  } catch (error) {
    consumeError(error);
  }
};

const diffArray = (arr1, arr2) => {
  return arr1
    .concat(arr2)
    .filter((item) => !arr1.includes(item) || !arr2.includes(item));
};
