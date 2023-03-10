const { externalApiCaller } = require("../../../utils");
const generateManagementToken = require("../GenerateManagementToken");

const orchestrator = async (endpoint, payload, method = "post") => {
  try {
    const managementToken = await generateManagementToken();

    const apiEndpoint = `${process.env.VIDEO_CONSULTATION_HOST}${endpoint}`;

    const headers = {
      "Content-Length": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${managementToken}`,
    };

    const response = await externalApiCaller(
      apiEndpoint,
      method,
      headers,
      payload
    );

    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = orchestrator;
