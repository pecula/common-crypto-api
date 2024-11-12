// src/utils/axiosUtils.ts
import axios, { AxiosResponse } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

export const makeRequest = async (
  method: "get" | "post",
  url: string,
  data: Object = {},
  proxyUrl?: string,
  headers: Object = {}
): Promise<AxiosResponse<any>> => {
  try {
    const config: any = {
      method,
      url,
      headers: { ...headers },
      timeout: 10000,
    };

    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      config.httpsAgent = agent;
    }

    // if (method === "post") {
    //   config.data = data;
    // }

    const response = await axios(config);
    return response;
  } catch (error) {
    throw error;
  }
};