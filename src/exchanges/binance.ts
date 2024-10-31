import { AxiosResponse, AxiosError } from 'axios';
import { ExchangeInterface, OrderResponse } from './ExchangeInterface';
import { makeRequest } from '../utils/axiosUtils';
import * as crypto from 'crypto-js';

export class Binance implements ExchangeInterface {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private proxyUrl: string | undefined;

  constructor(apiKey: string, apiSecret: string, testnet?: boolean, proxyUrl?: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    if (testnet) {
      this.baseUrl = 'https://testnet.binancefuture.com/fapi';
    } else {
      this.baseUrl = 'https://fapi.binance.com';
    }
    this.proxyUrl = proxyUrl;
  }

  private generateSignature(queryString: string, apiSecret: string): string {
    return crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  }

  public async getBalance(): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      const endpoint = '/fapi/v3/balance';
      const queryString = `timestamp=${timestamp}`;
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };

      const response = await makeRequest('get', url, {}, this.proxyUrl, headers);
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError ? error.message : 'Unable to fetch balance';
    }
  }

  public async setLeverage(symbol: string, leverage: number): Promise<any> {
    try {
      const timestamp = Date.now();
      const endpoint = '/fapi/v1/leverage';
      let queryString = `symbol=${symbol}&leverage=${leverage}&timestamp=${timestamp}`;
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };

      const response = await makeRequest('post', url, {}, this.proxyUrl, headers);
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError ? error.message : 'Unable to set leverage';
    }
  }

  public async fetchAllOrders(): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}/v1/allOrders?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };

      const response = await makeRequest('get', url, {}, this.proxyUrl, headers);
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError ? error.message : 'Unable to fetch all orders';
    }
  }

  public async placeOrder(
    pair: string,
    type: 'market' | 'limit',
    side: 'buy' | 'sell',
    amount: number,
    price: number,
    params?: Object,
  ): Promise<AxiosResponse<OrderResponse>> {
    try {
      const timestamp = Date.now();
      const queryString = `symbol=${pair}&side=${side}&quantity=${amount}&timestamp=${timestamp}`;
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}/api/v1/order?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };

      return await makeRequest('post', url, {}, this.proxyUrl, headers);
    } catch (error) {
      throw error instanceof AxiosError ? error.message : 'Unable to place order';
    }
  }
}
