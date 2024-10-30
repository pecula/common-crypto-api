import axios, { AxiosResponse } from "axios";
import { BalanceResponse, ExchangeInterface, OrderResponse } from "./ExchangeInterface";

export class Bybit implements ExchangeInterface {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(apiKey: string, apiSecret: string, testnet?: boolean) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    if (testnet) {
      this.baseUrl = "https://testnet.bybit.com/fapi"; //correct the URL alter
    } else {
      this.baseUrl = "https://api.bybit.com";
    }
  }

  public async getBalance(): Promise<AxiosResponse<BalanceResponse>> {
    // Add logic to fetch the balance from Bybit
    return await axios.get(`${this.baseUrl}/v2/private/wallet/balance`, {
      headers: {
        "X-BYBIT-APIKEY": this.apiKey,
      },
    });
  }
  public async getLeverage(): Promise<AxiosResponse<BalanceResponse>> {
    // Add logic to fetch the balance from Bybit
    return await axios.get(`${this.baseUrl}/v2/private/wallet/balance`, {
      headers: {
        "X-BYBIT-APIKEY": this.apiKey,
      },
    });
  }
  public async setLeverage(
    symbol: string,
    leverage: number
  ): Promise<AxiosResponse<BalanceResponse>> {
    // Add logic to fetch the balance from Bybit
    return await axios.get(`${this.baseUrl}/v2/private/wallet/balance`, {
      headers: {
        "X-BYBIT-APIKEY": this.apiKey,
      },
    });
  }
  public async fetchAllOrders(): Promise<Object[]> {
    return await axios.get(`${this.baseUrl}/v2/private/wallet/balance`, {
      headers: {
        "X-BYBIT-APIKEY": this.apiKey,
      },
    });
  }

  public async placeOrder(
    symbol: string,
    type: "market" | "limit",
    side: string,
    quantity: number,
    price: number
  ): Promise<AxiosResponse<OrderResponse>> {
    // Add logic to place an order on Bybit
    return await axios.post(
      `${this.baseUrl}/v2/private/order/create`,
      { symbol, side, qty: quantity, price },
      {
        headers: {
          "X-BYBIT-APIKEY": this.apiKey,
        },
      }
    );
  }
}
