import axios from "axios";

import config from "../../config/env.js";

export const sendToWhatsapp = async (data) => {
  const baseUrl = `https://graph.facebook.com/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`;
  const headers = {
    Authorization: `Bearer ${config.API_TOKEN}`,
  };

  try {
    const response = await axios.post(baseUrl, data, { headers });

    return response.data;
  } catch (error) {
    console.log("Error sending message:", error);
  }
};
