import axios, { AxiosResponse, AxiosError } from "axios";
import * as crypto from "crypto-js";

import { ExchangeInterface, OrderResponse } from "./ExchangeInterface";

export class Binance implements ExchangeInterface {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(apiKey: string, apiSecret: string, testnet?: boolean) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    if (testnet) {
      this.baseUrl = "https://testnet.binancefuture.com/fapi";
    } else {
      this.baseUrl = "https://api.binance.com/api/v3/account";
    }
  }
  public async getBalance(): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      // Generate HMAC SHA256 signature
      const signature = crypto
        .HmacSHA256(queryString, this.apiSecret)
        .toString(crypto.enc.Hex);
      this.baseUrl = `${this.baseUrl}/v3/balance?${queryString}&signature=${signature}`;

      // Add logic to fetch the balance from Binance
      const response = await axios.get(`${this.baseUrl}`, {
        headers: {
          "X-MBX-APIKEY": this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError
        ? error.message
        : "unable to fetch balance";
    }
  }
  public async getLeverage(): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      // Generate HMAC SHA256 signature
      const signature = crypto
        .HmacSHA256(queryString, this.apiSecret)
        .toString(crypto.enc.Hex);
      this.baseUrl = `${this.baseUrl}/v1/leverageBracket?${queryString}&signature=${signature}`;

      const response = await axios.get(`${this.baseUrl}`, {
        headers: {
          "X-MBX-APIKEY": this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError
        ? error.message
        : "unable to fetch leverage";
    }
  }
  public async setLeverage(
    symbol: string,
    leverage: number
  ): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      const queryString = `symbol=${symbol}&leverage=${leverage}&timestamp=${timestamp}`;
      // Generate HMAC SHA256 signature
      const signature = crypto
        .HmacSHA256(queryString, this.apiSecret)
        .toString(crypto.enc.Hex);
      this.baseUrl = `${this.baseUrl}/v1/leverage?${queryString}&signature=${signature}`;

      console.log(this.baseUrl);
      const response = await axios.post(
        this.baseUrl,
        {},
        {
          headers: {
            "X-MBX-APIKEY": this.apiKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError ? error : "unable to set leverage";
    }
  }
  public async fetchAllOrders(): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      // Generate HMAC SHA256 signature
      const signature = crypto
        .HmacSHA256(queryString, this.apiSecret)
        .toString(crypto.enc.Hex);
      this.baseUrl = `${this.baseUrl}/v1/allOrders?${queryString}&signature=${signature}`;

      // Add logic to fetch the balance from Binance
      const response = await axios.get(`${this.baseUrl}`, {
        headers: {
          "X-MBX-APIKEY": this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError
        ? error.message
        : "unable to fetch all orders";
    }
  }

  public async placeOrder(
    pair: string,
    type: "market" | "limit",
    side: "buy" | "sell",
    amount: number,
    price: number,
    params?: Object
  ): Promise<AxiosResponse<OrderResponse>> {
    try {
      const timestamp = Date.now();
      const queryString = `symbol=${pair}&side=${side}&quantity=${amount}&timestamp=${timestamp}`;
      const signature = crypto
        .HmacSHA256(queryString, this.apiSecret)
        .toString(crypto.enc.Hex);
      // Add logic to place an order on Binance
      return await axios.post(
        `${this.baseUrl}/api/v1/order`,
        {},
        {
          headers: {
            "X-MBX-APIKEY": this.apiKey,
          },
        }
      );
    } catch (error) {
      throw error instanceof AxiosError ? error : "unable to place order";
    }
  }
}
