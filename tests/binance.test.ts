import { Binance } from '../src/exchanges/binance';
import { makeRequest } from '../src/utils/axiosUtils';
import * as crypto from 'crypto-js';

jest.mock('../utils/axiosUtils');
jest.mock('crypto-js');

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
      (makeRequest as jest.Mock).mockResolvedValue(mockResponse);
      (crypto.HmacSHA256 as jest.Mock).mockReturnValue('mockSignature');

      const result = await binance.fetchTradeHistory(symbol);

      expect(makeRequest).toHaveBeenCalledWith(
        'get',
        `${baseUrl}/fapi/v1/userTrades?symbol=${symbol}&timestamp=${expect.any(Number)}&signature=mockSignature`,
        {},
        proxyUrl,
        { 'X-MBX-APIKEY': apiKey },
      );
      expect(result).toEqual(mockResponse.data);
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

      await expect(binance.fetchTradeHistory(symbol)).rejects.toEqual({ msg: 'Error message' });
    });
  });
});
