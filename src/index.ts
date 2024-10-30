import { AxiosResponse } from "axios";
import { Binance } from "./exchanges/binance";
import { Bybit } from "./exchanges/bybit";
import { OrderResponse } from "./exchanges/ExchangeInterface";

type ExchangeType = "binance" | "bybit";

export class MultiExchangeAPI {
  private exchange: Binance | Bybit;

  constructor(exchange: ExchangeType, apiKey: string, apiSecret: string) {
    switch (exchange) {
      case "binance":
        this.exchange = new Binance(apiKey, apiSecret);
        break;
      case "bybit":
        this.exchange = new Bybit(apiKey, apiSecret);
        break;
      default:
        throw new Error("Unsupported exchange");
    }
  }

  public async getBalance() {
    return await this.exchange.getBalance();
  }

  public async placeOrder(
    pair: string,
    type: "market" | "limit",
    side: "buy" | "sell",
    amount: number,
    price: number,
    params?: Object
  ): Promise<AxiosResponse<OrderResponse>> {
    return await this.exchange.placeOrder(
      pair,
      type,
      side,
      amount,
      price,
      params
    );
  }
}
