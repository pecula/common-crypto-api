import { CommonExchangeAPI } from '../src/index';
import { Binance } from '../src/exchanges/binance';
import { Bybit } from '../src/exchanges/bybit';

jest.mock('../src/exchanges/binance');
jest.mock('../src/exchanges/bybit');

describe('CommonExchangeAPI', () => {
  const apiKey = 'test-api-key';
  const apiSecret = 'test-api-secret';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create an instance with Binance exchange', () => {
    new CommonExchangeAPI('binance', apiKey, apiSecret);
    expect(Binance).toHaveBeenCalledWith(apiKey, apiSecret, undefined, undefined);
  });

  test('should create an instance with Bybit exchange', () => {
    new CommonExchangeAPI('bybit', apiKey, apiSecret);
    expect(Bybit).toHaveBeenCalledWith(apiKey, apiSecret, undefined, undefined);
  });

  test('should throw an error for unsupported exchange', () => {
    expect(
      () => new CommonExchangeAPI('unsupported' as any, apiKey, apiSecret)
    ).toThrow('Unsupported exchange');
  });

  test('getBalance should return balance from Binance', async () => {
    const mockResponse = { balance: 1000 };
    Binance.prototype.getBalance = jest.fn().mockResolvedValue(mockResponse);

    const commonExchangeAPI = new CommonExchangeAPI('binance', apiKey, apiSecret);
    const result = await commonExchangeAPI.getBalance();
    expect(result).toEqual(mockResponse);
  });

  test('createOrder should place order on Binance', async () => {
    const mockResponse = { orderId: '12345' };
    Binance.prototype.createOrder = jest.fn().mockResolvedValue(mockResponse);

    const commonExchangeAPI = new CommonExchangeAPI('binance', apiKey, apiSecret);
    const result = await commonExchangeAPI.createOrder('BTCUSD', 'limit', 'buy', 1, 50000);
    expect(result).toEqual(mockResponse);
  });

  test('setLeverage should set leverage on Binance', async () => {
    const mockResponse = { success: true };
    Binance.prototype.setLeverage = jest.fn().mockResolvedValue(mockResponse);

    const commonExchangeAPI = new CommonExchangeAPI('binance', apiKey, apiSecret);
    const result = await commonExchangeAPI.setLeverage('BTCUSD', 10);
    expect(result).toEqual(mockResponse);
  });

  test('fetchPositions should return positions from Binance', async () => {
    const mockResponse = [{ symbol: 'BTCUSD', positionAmt: '1' }];
    Binance.prototype.fetchPositions = jest.fn().mockResolvedValue(mockResponse);

    const commonExchangeAPI = new CommonExchangeAPI('binance', apiKey, apiSecret);
    const result = await commonExchangeAPI.fetchPositions();
    expect(result).toEqual(mockResponse);
  });

  test('setPositionMode should set position mode on Binance', async () => {
    const mockResponse = { success: true };
    Binance.prototype.setPositionMode = jest.fn().mockResolvedValue(mockResponse);

    const commonExchangeAPI = new CommonExchangeAPI('binance', apiKey, apiSecret);
    const result = await commonExchangeAPI.setPositionMode('true', 'BTCUSD');
    expect(result).toEqual(mockResponse);
  });

  test('setMarginMode should set margin mode on Binance', async () => {
    const mockResponse = { success: true };
    Binance.prototype.setMarginMode = jest.fn().mockResolvedValue(mockResponse);

    const commonExchangeAPI = new CommonExchangeAPI('binance', apiKey, apiSecret);
    const result = await commonExchangeAPI.setMarginMode('isolated', 'BTCUSD');
    expect(result).toEqual(mockResponse);
  });
});