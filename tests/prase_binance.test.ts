import { parseTrade } from '../src/exchanges/formatted/prase_binance';

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
