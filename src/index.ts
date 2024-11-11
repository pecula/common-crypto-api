import { AxiosResponse } from "axios";
import { Binance } from "./exchanges/binance";
import { Bybit } from "./exchanges/bybit";
import { OrderResponse } from "./exchanges/ExchangeInterface";

type ExchangeType = "binance" | "bybit";

export const exchanges = ["binance", "bybit"];

export class CommonExchangeAPI {
  private exchange: Binance | Bybit;

  constructor(
    exchange: ExchangeType,
    apiKey: string,
    apiSecret: string,
    testnet?: boolean,
    proxyUrl?: string
  ) {
    switch (exchange) {
      case "binance":
        this.exchange = new Binance(apiKey, apiSecret, testnet, proxyUrl);
        break;
      case "bybit":
        this.exchange = new Bybit(apiKey, apiSecret, testnet, proxyUrl);
        break;
      default:
        throw new Error("Unsupported exchange");
    }
  }

  public async getBalance() {
    return await this.exchange.getBalance();
  }
  public async setLeverage(symbol: string, leverage: number) {
    return await this.exchange.setLeverage(symbol, leverage);
  }
  public async fetchPositions() {
    return await this.exchange.fetchPositions();
  }

  public async createOrder(
    pair: string,
    type: "market" | "limit",
    side: "buy" | "sell",
    amount: number,
    price: number,
    params?: Object
  ): Promise<AxiosResponse<OrderResponse>> {
    return await this.exchange.createOrder(
      pair,
      type,
      side,
      amount,
      price,
      params
    );
  }

   public async setPositionMode(mode: 'true' | 'false', symbol: string) {
    return await this.exchange.setPositionMode(mode, symbol);
  }

  public async setMarginMode(mode: 'isolated' | 'cross', symbol: string) {
    return await this.exchange.setMarginMode(mode, symbol);
  }

  public async fetchTradeHistory(symbol: string, orderId?: string, startTime?: number, endTime?: number) {
    return await this.exchange.fetchTradeHistory(symbol, orderId, startTime, endTime);
  }
}
