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
    let axiosInstance: any = axios;
    if (proxyUrl) {
      const agent = new HttpsProxyAgent(proxyUrl);
      axiosInstance = axios.create({
        baseURL: url,
        httpsAgent: agent,
        timeout: 10000,
      });
    }

    const response = await axiosInstance({
      method,
      url,
      headers: { ...headers },
      //   data: method === "post" ? data : undefined,
    });

    return response;
  } catch (error) {
    throw error;
  }
};