import { AxiosResponse, AxiosError } from 'axios';
import { BalanceResponse, ExchangeInterface, OrderResponse } from './ExchangeInterface';
import { makeRequest } from '../utils/axiosUtils';
import * as crypto from 'crypto-js';

export class Bybit implements ExchangeInterface {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private proxyUrl: string | undefined;

  constructor(apiKey: string, apiSecret: string, testnet?: boolean, proxyUrl?: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    if (testnet) {
      this.baseUrl = 'https://api-testnet.bybit.com';
    } else {
      this.baseUrl = 'https://api.bybit.com';
    }
    this.proxyUrl = proxyUrl;
  }

  private generateSign(queryString: string, apiSecret: string): string {
    return crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
  }

  private generateSignature(params: any): string {
    const orderedParams = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {} as any);

    const queryString = Object.keys(orderedParams)
      .map((key) => `${key}=${orderedParams[key]}`)
      .join('&');

    return this.generateSign(queryString, this.apiSecret);
  }

  public async getBalance(): Promise<AxiosResponse<BalanceResponse>> {
    try {
      const timestamp = Date.now();
      const params = { api_key: this.apiKey, timestamp: timestamp.toString() };
      const signature = this.generateSignature(params);
      const url = `${this.baseUrl}/v2/private/wallet/balance?${new URLSearchParams(params).toString()}&sign=${signature}`;
      const headers = {
        "X-MBX-APIKEY": this.apiKey, // correct the header later
      };

      const response = await makeRequest('get', url, {}, this.proxyUrl, headers);
      return response;
    } catch (error) {
      throw error instanceof AxiosError ? error.message : 'Unable to fetch balance';
    }
  }

  public async setLeverage(symbol: string, leverage: number): Promise<AxiosResponse<any>> {
    try {
      const timestamp = Date.now();
      const params = { api_key: this.apiKey, symbol, leverage: leverage.toString(), timestamp: timestamp.toString() };
      const signature = this.generateSignature(params);
      const url = `${this.baseUrl}/v2/private/position/leverage/save?${new URLSearchParams(params).toString()}&sign=${signature}`;

      const response = await makeRequest('post', url, {}, this.proxyUrl);
      return response;
    } catch (error) {
      throw error instanceof AxiosError ? error.message : 'Unable to set leverage';
    }
  }

  public async fetchAllOrders(): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      const params = { api_key: this.apiKey, timestamp: timestamp.toString() };
      const signature = this.generateSignature(params);
      const url = `${this.baseUrl}/v2/private/order/list?${new URLSearchParams(params).toString()}&sign=${signature}`;

      const response = await makeRequest('get', url, {}, this.proxyUrl);
      return response.data;
    } catch (error) {
      throw error instanceof AxiosError ? error.message : 'Unable to fetch all orders';
    }
  }

  public async placeOrder(
    symbol: string,
    type: 'market' | 'limit',
    side: string,
    quantity: number,
    price: number,
  ): Promise<AxiosResponse<OrderResponse>> {
    try {
      const timestamp = Date.now();
      const params = { 
        api_key: this.apiKey, 
        symbol, 
        side, 
        qty: quantity.toString(), 
        price: price.toString(), 
        timestamp: timestamp.toString() 
      };
      const signature = this.generateSignature(params);
      const url = `${this.baseUrl}/v2/private/order/create?${new URLSearchParams(params).toString()}&sign=${signature}`;

      const response = await makeRequest('post', url, {}, this.proxyUrl);
      return response;
    } catch (error) {
      throw error instanceof AxiosError ? error.message : 'Unable to place order';
    }
  }

    // mode: 'true' for Hedge Mode, 'false' for One-way Mode
    public async setPositionMode(mode: 'true' | 'false', symbol: string): Promise<any> {
      try {
        const timestamp = Date.now();
        const endpoint = '/fapi/v1/positionSide/dual';
        const params = { 
          api_key: this.apiKey, 
          symbol, 
          mode,
          timestamp: timestamp.toString() 
        };
        const signature = this.generateSignature(params);
        const url = `${this.baseUrl}${endpoint}?${new URLSearchParams(params).toString()}&sign=${signature}`;
        const headers = {
          'X-MBX-APIKEY': this.apiKey,
        };
  
        const response = await makeRequest('post', url, {}, this.proxyUrl, headers);
        return response.data;
      } catch (error) {
        throw error instanceof AxiosError ? error.message : 'Unable to set position mode';
      }
    }

    public async setMarginMode(mode: string, symbol: string): Promise<any> {
      try {
        const timestamp = Date.now();
        const params = { api_key: this.apiKey, symbol, mode, timestamp: timestamp.toString() };
        const signature = this.generateSignature(params);
        const url = `${this.baseUrl}/v2/private/position/switch-isolated?${new URLSearchParams(params).toString()}&sign=${signature}`;
        const headers = {
          'X-MBX-APIKEY': this.apiKey,
        };
  
        const response = await makeRequest("post", url, {}, this.proxyUrl, headers);
        return response.data;
      } catch (error) {
        throw error instanceof AxiosError ? error.message : "Unable to set margin mode";
      }
    }
}
