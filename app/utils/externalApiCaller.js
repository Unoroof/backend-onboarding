const axios = require("axios");
const axiosInstance = axios.create();

const externalApiCaller = async (
  apiEndpoint,
  method = "post",
  headers,
  payload
) => {
  try {
    axiosInstance.defaults.headers = headers;

    const response = await axiosInstance[`${method}`](
      apiEndpoint,
      payload,
      headers
    );

    return await Promise.resolve(response.data);
  } catch (error) {
    console.log("CATCH_ERROR", error);

    return Promise.reject(error);
  }
};

module.exports = externalApiCaller;
