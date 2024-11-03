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

  private parsePosition(position: any): PositionResponse | null {
    const entryPrice = position.entryPrice;
    if (entryPrice === '0' || entryPrice === '0.0' || entryPrice === '0.00000000') {
      return null;
    }

    const notional = Math.abs(parseFloat(position.notional));
    const contracts = parseFloat(position.positionAmt);
    const unrealizedPnl = parseFloat(position.unRealizedProfit);
    const leverage = parseInt(position.leverage);
    const liquidationPrice = parseFloat(position.liquidationPrice);
    const entryPriceFloat = parseFloat(position.entryPrice);
    const markPrice = parseFloat(position.markPrice);
    const collateral = Math.abs((contracts * entryPriceFloat) / leverage);
    const initialMargin = (contracts * entryPriceFloat) / leverage;
    const maintenanceMargin = contracts * markPrice * 0.004;
    const marginRatio = maintenanceMargin / collateral;
    const percentage = (unrealizedPnl / initialMargin) * 100;
    const timestamp = parseInt(position.updateTime);

    return {
      info: position,
      symbol: `${position.symbol.slice(0, -4)}/${position.symbol.slice(-4)}:USDT`,
      contracts,
      contractSize: 1,
      unrealizedPnl,
      leverage,
      liquidationPrice,
      collateral,
      notional,
      markPrice,
      entryPrice: entryPriceFloat,
      timestamp,
      initialMargin,
      initialMarginPercentage: 1 / leverage,
      maintenanceMargin,
      maintenanceMarginPercentage: 0.004,
      marginRatio,
      datetime: new Date(timestamp).toISOString(),
      marginMode: position.marginType,
      marginType: position.marginType,
      side: position.positionSide.toLowerCase(),
      hedged: true,
      percentage,
    };
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

    // Example response:
    //   {
    //     "symbol": "ETHUSDT",
    //     "positionAmt": "-0.010",
    //     "entryPrice": "2468.49",
    //     "breakEvenPrice": "2467.255755",
    //     "markPrice": "2473.15992704",
    //     "unRealizedProfit": "-0.04669927",
    //     "liquidationPrice": "2949.15712649",
    //     "leverage": "5",
    //     "maxNotionalValue": "320000000",
    //     "marginType": "isolated",
    //     "isolatedMargin": "4.87793828",
    //     "isAutoAddMargin": "false",
    //     "positionSide": "SHORT",
    //     "notional": "-24.73159927",
    //     "isolatedWallet": "4.92463755",
    //     "updateTime": "1730667935892",
    //     "isolated": true,
    //     "adlQuantile": "1"
    // }

      const result: PositionResponse[] = [];
      for (let i = 0; i < response.data.length; i++) {
        const parsed = this.parsePosition(response.data[i]);
        if (parsed !== null) {
          result.push(parsed);
        }
      }
      return result;
    } catch (error) {
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }

  public async createOrder(
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
      const modeCase = mode == 'cross' ? 'CROSSED' : mode.toUpperCase();
      const endpoint = '/fapi/v1/marginType';
      const queryString = `symbol=${symbol}&marginType=${modeCase}&timestamp=${timestamp}`;
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
}
