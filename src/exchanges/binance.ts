import { AxiosResponse, AxiosError } from 'axios';
import { ExchangeInterface, OrderResponse, PositionResponse, AllOrders } from './ExchangeInterface';
import { makeRequest } from '../utils/axiosUtils';
import * as crypto from 'crypto-js';
import { parsePosition, parseTrade, parseAllOrders } from './formatted/prase_binance';

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

  public async fetchClosedOrders(symbol?: string): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      let queryString = `timestamp=${timestamp}`;
      if (symbol != "") {
          queryString += `&symbol=${symbol}`;
      }
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}/fapi/v1/allOrders?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };
      const response = await makeRequest('get', url, {}, this.proxyUrl, headers);

      const result: AllOrders[] = [];
      for (let i = 0; i < response.data.length; i++) {
        const parsed = parseAllOrders(response.data[i]);
        if (parsed !== null) {
          result.push(parsed);
        }
      }
      return result;
    } catch (error) {
      throw error instanceof AxiosError ? error.response?.data : error;
    }
    /*
    [
   {
     info: {
       orderId: '4066137237',
       symbol: 'BTCUSDT',
       status: 'FILLED',
       clientOrderId: 'web_AAnDicEckiUFMDO2xLRe',
       price: '0',
       avgPrice: '90369.70000',
       origQty: '0.002',
       executedQty: '0.002',
       cumQuote: '180.73940',
       timeInForce: 'GTC',
       type: 'MARKET',
       reduceOnly: false,
       closePosition: false,
       side: 'BUY',
       positionSide: 'BOTH',
       stopPrice: '0',
       workingType: 'CONTRACT_PRICE',
       priceMatch: 'NONE',
       selfTradePreventionMode: 'NONE',
       goodTillDate: '0',
       priceProtect: false,
       origType: 'MARKET',
       time: '1731382930786',
       updateTime: '1731382930786'
     },
     id: '4066137237',
     clientOrderId: 'web_AAnDicEckiUFMDO2xLRe',
     timestamp: 1731382930786,
     datetime: '2024-11-12T03:42:10.786Z',
     lastTradeTimestamp: 1731382930786,
     lastUpdateTimestamp: 1731382930786,
     symbol: 'BTC/USDT:USDT',
     type: 'market',
     timeInForce: 'GTC',
     postOnly: false,
     reduceOnly: false,
     side: 'buy',
     price: 90369.7,
     triggerPrice: undefined,
     amount: 0.002,
     cost: 180.7394,
     average: 90369.7,
     filled: 0.002,
     remaining: 0,
     status: 'closed',
     fee: undefined,
     trades: [],
     fees: [],
     stopPrice: undefined,
     takeProfitPrice: undefined,
     stopLossPrice: undefined
   }
 ]
    */
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
        const parsed = parsePosition(response.data[i]);
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

      const response = await makeRequest('post', url, {}, this.proxyUrl, headers);
      return response.data;
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

  public async fetchTradeHistory(symbol: string, orderId?: string, startTime?: number, endTime?: number): Promise<Object[]> {
    try {
      const timestamp = Date.now();
      let queryString = `symbol=${symbol}&timestamp=${timestamp}`;
      if (orderId) {
        queryString += `&orderId=${orderId}`;
      }
      if (startTime) {
        queryString += `&startTime=${startTime}`;
      }
      if (endTime) {
        queryString += `&endTime=${endTime}`;
      }
      const signature = this.generateSignature(queryString, this.apiSecret);
      const url = `${this.baseUrl}/fapi/v1/userTrades?${queryString}&signature=${signature}`;
      const headers = {
        'X-MBX-APIKEY': this.apiKey,
      };
  
      const response = await makeRequest('get', url, {}, this.proxyUrl, headers);
      
      // Example response:
      //   [
      //     {
      //       symbol: 'ETHUSDT',
      //       id: 129990184,
      //       orderId: 1467650881,
      //       side: 'BUY',
      //       price: '2549',
      //       qty: '0.208',
      //       realizedPnl: '0',
      //       quoteQty: '530.19200',
      //       commission: '0.21207680',
      //       commissionAsset: 'USDT',
      //       time: 1730763011865,
      //       positionSide: 'LONG',
      //       maker: false,
      //       buyer: true
      //     }
      //   ]

      const result: Object[] = [];
      for (let i = 0; i < response.data.length; i++) {
        const parsed = parseTrade(response.data[i]);
        result.push(parsed);
      }
      return result;
    } catch (error) {
      throw error instanceof AxiosError ? error.response?.data : error;
    }
  }
}
