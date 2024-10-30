export interface ExchangeInterface {
  placeOrder(
    pair: string,
    type: "market" | "limit",
    side: "buy" | "sell",
    amount: number,
    price?: number,
    params?: Object
  ): Promise<any>;
  getBalance(): Promise<any>;
}

export interface BalanceResponse {
  // Add any fields you expect from the Binance API response
}

export interface OrderResponse {
  // Add any fields you expect from the order placement response
}
