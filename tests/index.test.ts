import { CommonExchangeAPI } from "../src/index";
import { Binance } from "../src/exchanges/binance";
import { Bybit } from "../src/exchanges/bybit";

jest.mock("../src/exchanges/binance");
jest.mock("../src/exchanges/bybit");

describe("CommonExchangeAPI", () => {
  const apiKey = "test-api-key";
  const apiSecret = "test-api-secret";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create an instance with Binance exchange", () => {
    new CommonExchangeAPI("binance", apiKey, apiSecret);
    expect(Binance).toHaveBeenCalledWith(apiKey, apiSecret, undefined, undefined);
  });

  test("should create an instance with Bybit exchange", () => {
    new CommonExchangeAPI("bybit", apiKey, apiSecret);
    expect(Bybit).toHaveBeenCalledWith(apiKey, apiSecret, undefined, undefined);
  });

  test('should create an instance with Binance exchange with testnet and proxyUrl', () => {
    new CommonExchangeAPI('binance', apiKey, apiSecret, true, 'http://proxy-url');
    expect(Binance).toHaveBeenCalledWith(apiKey, apiSecret, true, 'http://proxy-url');
  });

  test('should create an instance with Bybit exchange with testnet and proxyUrl', () => {
    new CommonExchangeAPI('bybit', apiKey, apiSecret, true, 'http://proxy-url');
    expect(Bybit).toHaveBeenCalledWith(apiKey, apiSecret, true, 'http://proxy-url');
  });

  test("should throw an error for unsupported exchange", () => {
    expect(
      () => new CommonExchangeAPI("unsupported" as any, apiKey, apiSecret)
    ).toThrow("Unsupported exchange");
  });

  test("getBalance should return balance from Binance", async () => {
    const mockResponse = { balance: 1000 };
    Binance.prototype.getBalance = jest.fn().mockResolvedValue(mockResponse);

    const multiExchange = new CommonExchangeAPI("binance", apiKey, apiSecret);
    const result = await multiExchange.getBalance();
    expect(result).toEqual(mockResponse);
  });

  test("placeOrder should place order on Binance", async () => {
    const mockResponse = { orderId: "12345" };
    Binance.prototype.placeOrder = jest.fn().mockResolvedValue(mockResponse);

    const multiExchange = new CommonExchangeAPI("binance", apiKey, apiSecret);
    const result = await multiExchange.placeOrder(
      "BTCUSD",
      "limit",
      "buy",
      1,
      50000
    );
    expect(result).toEqual(mockResponse);
  });
});
