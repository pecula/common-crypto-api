import { parseTrade, parsePosition, parseAllOrders } from '../src/exchanges/formatted/prase_binance';

describe('parseTrade', () => {
  it('should parse trade data correctly', () => {
    const trade = {
      id: 12345,
      time: 1625234523000,
      symbol: 'BTCUSDT',
      orderId: 67890,
      side: 'BUY',
      maker: true,
      price: '34000.00',
      qty: '0.001',
      commission: '0.00001',
      commissionAsset: 'BTC',
    };

    const expected = {
      info: trade,
      id: '12345',
      timestamp: 1625234523000,
      datetime: new Date(1625234523000).toISOString(),
      symbol: 'BTC/USDT:USDT',
      order: '67890',
      type: undefined,
      side: 'buy',
      takerOrMaker: 'maker',
      price: 34000.0,
      amount: 0.001,
      cost: 34.0,
      fee: {
        cost: 0.00001,
        currency: 'BTC',
      },
      fees: [
        {
          cost: 0.00001,
          currency: 'BTC',
        },
      ],
    };

    const result = parseTrade(trade);
    expect(result).toEqual(expected);
  });

  it('should handle missing optional fields', () => {
    const trade = {
      id: 12345,
      time: 1625234523000,
      symbol: 'BTCUSDT',
      orderId: 67890,
      side: 'SELL',
      maker: false,
      price: '34000.00',
      qty: '0.001',
      commission: '0.00001',
      commissionAsset: 'BTC',
    };

    const expected = {
      info: trade,
      id: '12345',
      timestamp: 1625234523000,
      datetime: new Date(1625234523000).toISOString(),
      symbol: 'BTC/USDT:USDT',
      order: '67890',
      type: undefined,
      side: 'sell',
      takerOrMaker: 'taker',
      price: 34000.0,
      amount: 0.001,
      cost: 34.0,
      fee: {
        cost: 0.00001,
        currency: 'BTC',
      },
      fees: [
        {
          cost: 0.00001,
          currency: 'BTC',
        },
      ],
    };

    const result = parseTrade(trade);
    expect(result).toEqual(expected);
  });
});

describe('parsePosition', () => {
  it('should parse position data correctly', () => {
    const position = {
      entryPrice: '34000.00',
      notional: '0.034',
      positionAmt: '0.001',
      unRealizedProfit: '0.0005',
      leverage: '10',
      liquidationPrice: '30000.00',
      markPrice: '34050.00',
      updateTime: '1625234523000',
      symbol: 'BTCUSDT',
      marginType: 'cross',
      positionSide: 'LONG',
    };

    const expected = {
      info: position,
      symbol: 'BTC/USDT:USDT',
      contracts: 0.001,
      contractSize: 1,
      unrealizedPnl: 0.0005,
      leverage: 10,
      liquidationPrice: 30000.0,
      collateral: 3.4,
      notional: 0.034,
      markPrice: 34050.0,
      entryPrice: 34000.0,
      timestamp: 1625234523000,
      initialMargin: 3.4,
      initialMarginPercentage: 0.1,
      maintenanceMargin: 0.1362,
      maintenanceMarginPercentage: 0.004,
      marginRatio: 0.040058823529411765,
      datetime: new Date(1625234523000).toISOString(),
      marginMode: 'cross',
      marginType: 'cross',
      side: 'long',
      hedged: true,
      percentage: 0.014705882352941178,
    };

    const result = parsePosition(position);
    expect(result).toEqual(expected);
  });

  it('should return null for positions with zero entry price', () => {
    const position = {
      entryPrice: '0.00000000',
      notional: '0.034',
      positionAmt: '0.001',
      unRealizedProfit: '0.0005',
      leverage: '10',
      liquidationPrice: '30000.00',
      markPrice: '34050.00',
      updateTime: '1625234523000',
      symbol: 'BTCUSDT',
      marginType: 'cross',
      positionSide: 'LONG',
    };

    const result = parsePosition(position);
    expect(result).toBeNull();
  });
});

describe('parseAllOrders', () => {
  it('should parse all orders data correctly', () => {
    const order = {
      orderId: 12345,
      avgPrice: '34000.00',
      cumQuote: '34000.00',
      reduceOnly: false,
      side: 'BUY',
      symbol: 'BTCUSDT',
      status: 'FILLED',
      type: 'LIMIT',
      timeInForce: 'GTC',
      clientOrderId: 'testOrder123',
    };

    const expected = {
      info: order,
      id: 12345,
      reduceOnly: false,
      side: 'BUY',
      symbol: 'BTCUSDT',
      status: 'FILLED',
      type: 'LIMIT',
      timeInForce: 'GTC',
      clientOrderId: 'testOrder123',
      price: 34000.0,
      cost: 34000.0,
    };

    const result = parseAllOrders(order);
    expect(result).toEqual(expected);
  });

  it('should handle missing optional fields', () => {
    const order = {
      orderId: 12345,
      avgPrice: '34000.00',
      cumQuote: '34000.00',
      reduceOnly: false,
      side: 'SELL',
      symbol: 'BTCUSDT',
      status: 'FILLED',
      type: 'LIMIT',
      timeInForce: 'GTC',
      clientOrderId: 'testOrder123',
    };

    const expected = {
      info: order,
      id: 12345,
      reduceOnly: false,
      side: 'SELL',
      symbol: 'BTCUSDT',
      status: 'FILLED',
      type: 'LIMIT',
      timeInForce: 'GTC',
      clientOrderId: 'testOrder123',
      price: 34000.0,
      cost: 34000.0,
    };

    const result = parseAllOrders(order);
    expect(result).toEqual(expected);
  });
});
