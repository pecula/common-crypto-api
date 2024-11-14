export interface ExchangeInterface {
  createOrder(pair: string, type: 'market' | 'limit', side: 'buy' | 'sell', amount: number, price?: number, params?: Object): Promise<any>;
  getBalance(): Promise<any>;
  setLeverage(symbol: string, leverage: number): Promise<any>;
}

export interface BalanceResponse {
  // Add any fields you expect from the Binance API response
}

export interface OrderResponse {
  // Add any fields you expect from the order placement response
}

export interface PositionResponse {
  info: object;
  symbol: string;
  contracts: number;
  contractSize: number;
  unrealizedPnl: number;
  leverage: number;
  liquidationPrice: number;
  collateral: number;
  notional: number;
  markPrice: number;
  entryPrice: number;
  timestamp: number;
  initialMargin: number;
  initialMarginPercentage: number;
  maintenanceMargin: number;
  maintenanceMarginPercentage: number;
  marginRatio: number;
  datetime: string;
  marginMode: string;
  marginType: string;
  side: string;
  hedged: boolean;
  percentage: number;
}
export interface AllOrders {
  info: any
  id: string;
  clientOrderId: string;
  symbol: string;
  status: string;
  side: string;
  type: string;
  timeInForce: string;
  price: number;
  cost: number;
  reduceOnly: boolean;
}
export interface parseLoadmarketesPrice {
  min: number;
  max: number;
}
export interface ParseLoadmarketesLimits {
  price: parseLoadmarketesPrice;
  amount: parseLoadmarketesPrice;
  cost: parseLoadmarketesPrice;
  market: parseLoadmarketesPrice;
}

export interface ConvertedItem {
  [key: string]: {
    id: string;
    base: string;
    baseId: string;
    quote: string;
    quoteId: string;
    status: string;
    spot: boolean;
    margin: boolean;
    limits: ParseLoadmarketesLimits;
  };
}
export interface FetchTicker {
  info: any
  symbol: string;
  high: number;
  low: number;
  open: number;
  close: number;
  last: number;
  change: number;
}