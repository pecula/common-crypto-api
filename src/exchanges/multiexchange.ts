import { Binance } from "./binance";
import { Bybit } from "./bybit";

type ExchangeType = "binance" | "bybit";

export class CommonExchangeAPI {
  private exchange: Binance | Bybit;

  constructor(
    exchange: ExchangeType,
    apiKey: string,
    apiSecret: string,
    testnet: boolean
  ) {
    switch (exchange) {
      case "binance":
        this.exchange = new Binance(apiKey, apiSecret, testnet);
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
  public async fetchAllOrders() {
    return await this.exchange.fetchAllOrders();
  }
  public async setLeverage(symbol: string, leverage: number) {
    return await this.exchange.setLeverage(symbol, leverage);
  }

  public async placeOrder(
    symbol: string,
    type: "limit" | "market",
    side: "buy" | "sell",
    quantity: number,
    price: number
  ) {
    return await this.exchange.placeOrder(symbol, type, side, quantity, price);
  }
}
