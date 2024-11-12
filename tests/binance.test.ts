import { Binance } from '../src/exchanges/binance';
import { makeRequest } from '../src/utils/axiosUtils';
import * as crypto from 'crypto-js';
import { parseTrade, parsePosition, parseAllOrders } from '../src/exchanges/formatted/prase_binance';

jest.mock('../src/utils/axiosUtils');
jest.mock('crypto-js');
jest.mock('../src/exchanges/formatted/prase_binance');

describe('Binance', () => {
  let binance: Binance;
  const apiKey = 'testApiKey';
  const apiSecret = 'testApiSecret';
  const baseUrl = 'https://fapi.binance.com';
  const proxyUrl = 'http://proxy.com';

  beforeEach(() => {
    binance = new Binance(apiKey, apiSecret, false, proxyUrl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTradeHistory', () => {
    it('should fetch trade history successfully', async () => {
      const symbol = 'BTCUSDT';
      const mockResponse = { data: [{ id: 1, symbol: 'BTCUSDT', price: '50000' }] };
      const parsedTrade = {
        info: { id: 1, symbol: 'BTCUSDT', price: '50000' },
        id: '1',
        timestamp: expect.any(Number),
        datetime: expect.any(String),
        symbol: 'BTC/USDT:USDT',
        order: undefined,
        type: undefined,
        side: undefined,
        takerOrMaker: undefined,
        price: 50000.0,
        amount: undefined,
        cost: undefined,
        fee: undefined,
        fees: [],
      };
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');
      (parseTrade as jest.Mock).mockReturnValue(parsedTrade);

      const result = await binance.fetchTradeHistory(symbol);

      expect(makeRequest).toHaveBeenCalledWith(
        'get',
        expect.stringMatching(new RegExp(`^${baseUrl}/fapi/v1/userTrades\\?symbol=${symbol}&timestamp=\\d+&signature=mockSignature+$`)),
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(parseTrade).toHaveBeenCalledWith(mockResponse.data[0]);
      expect(result).toEqual([parsedTrade]);
    });

    it('should throw an error if request fails', async () => {
      const symbol = 'BTCUSDT';
      const mockError = new Error('Request failed');
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.fetchTradeHistory(symbol)).rejects.toThrow('Request failed');
    });

    it('should throw an error with response data if AxiosError occurs', async () => {
      const symbol = 'BTCUSDT';
      const mockError = {
        isAxiosError: true,
        response: { data: { msg: 'Error message' } },
      };
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.fetchTradeHistory(symbol)).rejects.toEqual(mockError);
    });
  });

  describe('fetchClosedOrders', () => {
    it('should fetch closed orders successfully', async () => {
      const symbol = 'BTCUSDT';
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

      const mockResponse = { data: [order] };

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

      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');
      (parseAllOrders as jest.Mock).mockReturnValue(expected);

      const result = await binance.fetchClosedOrders(symbol);

      expect(makeRequest).toHaveBeenCalledWith(
        'get',
        expect.stringMatching(new RegExp(`^${baseUrl}/fapi/v1/allOrders\\?timestamp=\\d+&symbol=${symbol}&signature=mockSignature$`)),
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(parseAllOrders).toHaveBeenCalledWith(mockResponse.data[0]);
      expect(result).toEqual([expected]);
    });

    it('should throw an error if request fails', async () => {
      const symbol = 'BTCUSDT';
      const mockError = new Error('Request failed');
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.fetchClosedOrders(symbol)).rejects.toThrow('Request failed');
    });

    it('should throw an error with response data if AxiosError occurs', async () => {
      const symbol = 'BTCUSDT';
      const mockError = {
        isAxiosError: true,
        response: { data: { msg: 'Error message' } },
      };
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.fetchClosedOrders(symbol)).rejects.toEqual(mockError);
    });
  });

  describe('getBalance', () => {
    it('should fetch balance successfully', async () => {
      const mockResponse = { data: [{ asset: 'BTC', free: '0.5', locked: '0.1' }] };
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      const result = await binance.getBalance();

      expect(makeRequest).toHaveBeenCalledWith(
        'get',
        expect.stringMatching(new RegExp(`^${baseUrl}/fapi/v3/balance\\?timestamp=\\d+&signature=mockSignature$`)),
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if request fails', async () => {
      const mockError = new Error('Request failed');
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.getBalance()).rejects.toThrow('Request failed');
    });

    it('should throw an error with response data if AxiosError occurs', async () => {
      const mockError = {
        isAxiosError: true,
        response: { data: { msg: 'Error message' } },
      };
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.getBalance()).rejects.toEqual(mockError);
    });
  });

  describe('setLeverage', () => {
    it('should set leverage successfully', async () => {
      const symbol = 'BTCUSDT';
      const leverage = 10;
      const mockResponse = { data: { leverage: 10 } };
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      const result = await binance.setLeverage(symbol, leverage);

      expect(makeRequest).toHaveBeenCalledWith(
        'post',
        expect.stringMatching(
          new RegExp(`^${baseUrl}/fapi/v1/leverage\\?symbol=${symbol}&leverage=${leverage}&timestamp=\\d+&signature=mockSignature$`),
        ),
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if request fails', async () => {
      const symbol = 'BTCUSDT';
      const leverage = 10;
      const mockError = new Error('Request failed');
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.setLeverage(symbol, leverage)).rejects.toThrow('Request failed');
    });

    it('should throw an error with response data if AxiosError occurs', async () => {
      const symbol = 'BTCUSDT';
      const leverage = 10;
      const mockError = {
        isAxiosError: true,
        response: { data: { msg: 'Error message' } },
      };
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.setLeverage(symbol, leverage)).rejects.toEqual(mockError);
    });
  });

  describe('fetchPositions', () => {
    it('should fetch positions successfully', async () => {
      const mockResponse = { data: [{ symbol: 'BTCUSDT', positionAmt: '0.1', entryPrice: '50000' }] };
      const parsedPosition = {
        symbol: 'BTCUSDT',
        positionAmt: 0.1,
        entryPrice: 50000,
      };
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');
      (parsePosition as jest.Mock).mockReturnValue(parsedPosition);

      const result = await binance.fetchPositions();

      expect(makeRequest).toHaveBeenCalledWith(
        'get',
        expect.stringMatching(new RegExp(`^${baseUrl}/fapi/v2/positionRisk\\?timestamp=\\d+&signature=mockSignature$`)),
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(parsePosition).toHaveBeenCalledWith(mockResponse.data[0]);
      expect(result).toEqual([parsedPosition]);
    });

    it('should throw an error if request fails', async () => {
      const mockError = new Error('Request failed');
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.fetchPositions()).rejects.toThrow('Request failed');
    });

    it('should throw an error with response data if AxiosError occurs', async () => {
      const mockError = {
        isAxiosError: true,
        response: { data: { msg: 'Error message' } },
      };
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.fetchPositions()).rejects.toEqual(mockError);
    });
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const pair = 'BTCUSDT';
      const type = 'limit';
      const side = 'buy';
      const amount = 1;
      const price = 50000;
      const mockResponse = { data: { orderId: 12345 } };
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      const result = await binance.createOrder(pair, type, side, amount, price);

      expect(makeRequest).toHaveBeenCalledWith(
        'post',
        expect.stringMatching(
          new RegExp(
            `^${baseUrl}/fapi/v1/order\\?symbol=${pair}&side=BUY&type=${type}&quantity=${amount}&timestamp=\\d+&price=${price}&signature=mockSignature$`,
          ),
        ),
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if request fails', async () => {
      const pair = 'BTCUSDT';
      const type = 'limit';
      const side = 'buy';
      const amount = 1;
      const price = 50000;
      const mockError = new Error('Request failed');
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.createOrder(pair, type, side, amount, price)).rejects.toThrow('Request failed');
    });

    it('should throw an error with response data if AxiosError occurs', async () => {
      const pair = 'BTCUSDT';
      const type = 'limit';
      const side = 'buy';
      const amount = 1;
      const price = 50000;
      const mockError = {
        isAxiosError: true,
        response: { data: { msg: 'Error message' } },
      };
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.createOrder(pair, type, side, amount, price)).rejects.toEqual(mockError);
    });
  });

  describe('setPositionMode', () => {
    it('should set position mode successfully', async () => {
      const mode = 'true';
      const symbol = 'BTCUSDT';
      const mockResponse = { data: { msg: 'success' } };
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      const result = await binance.setPositionMode(mode, symbol);

      expect(makeRequest).toHaveBeenCalledWith(
        'post',
        expect.stringMatching(
          new RegExp(`^${baseUrl}/fapi/v1/positionSide/dual\\?symbol=${symbol}&dualSidePosition=${mode}&timestamp=\\d+&signature=mockSignature$`),
        ),
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if request fails', async () => {
      const mode = 'true';
      const symbol = 'BTCUSDT';
      const mockError = new Error('Request failed');
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.setPositionMode(mode, symbol)).rejects.toThrow('Request failed');
    });

    it('should throw an error with response data if AxiosError occurs', async () => {
      const mode = 'true';
      const symbol = 'BTCUSDT';
      const mockError = {
        isAxiosError: true,
        response: { data: { msg: 'Error message' } },
      };
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.setPositionMode(mode, symbol)).rejects.toEqual(mockError);
    });
  });

  describe('setMarginMode', () => {
    it('should set margin mode successfully', async () => {
      const mode = 'cross';
      const symbol = 'BTCUSDT';
      const mockResponse = { data: { msg: 'success' } };
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      const result = await binance.setMarginMode(mode, symbol);

      expect(makeRequest).toHaveBeenCalledWith(
        'post',
        expect.stringMatching(
          new RegExp(`^${baseUrl}/fapi/v1/marginType\\?symbol=${symbol}&marginType=CROSSED&timestamp=\\d+&signature=mockSignature$`),
        ),
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if request fails', async () => {
      const mode = 'cross';
      const symbol = 'BTCUSDT';
      const mockError = new Error('Request failed');
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.setMarginMode(mode, symbol)).rejects.toThrow('Request failed');
    });

    it('should throw an error with response data if AxiosError occurs', async () => {
      const mode = 'cross';
      const symbol = 'BTCUSDT';
      const mockError = {
        isAxiosError: true,
        response: { data: { msg: 'Error message' } },
      };
      (makeRequest as jest.Mock).mockRejectedValue(mockError);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      await expect(binance.setMarginMode(mode, symbol)).rejects.toEqual(mockError);
    });
  });
});
