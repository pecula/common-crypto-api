import { AxiosResponse, AxiosError } from 'axios';
import { ExchangeInterface, OrderResponse, PositionResponse } from './ExchangeInterface';
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
      this.baseUrl = 'https://testnet.binancefuture.com';
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
      throw error instanceof AxiosError ? error.response?.data : error;
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
      if (error instanceof AxiosError && error.response) {
        console.error('Error message:', error.response.data.msg);
        throw new Error(error.response.data.msg);
      } else {
        throw error instanceof AxiosError ? error.response?.data : error;
      }
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
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }
  public async fetchPositions(): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      const endpoint = '/fapi/v2/positionRisk';
      const queryString = `timestamp=${timestamp}`;
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };

      const response = await makeRequest('get', url, {}, this.proxyUrl, headers);
      // return response.data;
      const positions: PositionResponse[] = response.data.map((position: PositionResponse) => ({
        symbol: position.symbol,
        positionSide: position.positionSide,
      }));
      return positions;
    } catch (error) {
      throw error instanceof AxiosError ? error.response?.data : error;
      // throw error instanceof AxiosError ? error.message : 'Unable to fetch positions';
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
      const sideCase = side.toUpperCase();
      const timestamp = Date.now();
      let queryString = `symbol=${pair}&side=${sideCase}&type=${type}&quantity=${amount}&timestamp=${timestamp}`;
      if (type == 'limit') {
        if (price) {
          queryString += `&price=${price}`;
        } else {
          throw new Error('Price is required for limit orders');
        }
      }
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          queryString += `&${key}=${value}`;
        }
      }
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}/fapi/v1/order?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };

      return await makeRequest('post', url, {}, this.proxyUrl, headers);
    } catch (error) {
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }

  // mode: 'true' for Hedge Mode, 'false' for One-way Mode
  public async setPositionMode(mode: 'true' | 'false', symbol: string): Promise<any> {
    try {
      const timestamp = Date.now();
      const endpoint = '/fapi/v1/positionSide/dual';
      const queryString = `symbol=${symbol}&dualSidePosition=${mode}&timestamp=${timestamp}`;
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };

      const response = await makeRequest('post', url, {}, this.proxyUrl, headers);
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }

  public async setMarginMode(mode: string, symbol: string): Promise<any> {
    try {
      const timestamp = Date.now();
      const modeCase = mode == 'cross'? 'CROSSED' : mode.toUpperCase();
      const endpoint = "/fapi/v1/marginType";
      const queryString = `symbol=${symbol}&marginType=${modeCase}&timestamp=${timestamp}`;
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };


      const response = await makeRequest("post", url, {}, this.proxyUrl, headers);
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }
}
