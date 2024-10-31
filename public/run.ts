import { CommonExchangeAPI } from "../src/exchanges/multiexchange";

export const getBalance = async (): Promise<any> => {
  try {
    const multiExchange = new CommonExchangeAPI(
      "binance",
      "a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50",
      "ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89",
      true
    );

    const response = await multiExchange.getBalance();
    return response;
  } catch (error) {
    return error;
  }
};
export const fetchAllOrders = async (): Promise<any> => {
  try {
    const multiExchange = new CommonExchangeAPI(
      "binance",
      "a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50",
      "ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89",
      true
    );

    const response = await multiExchange.fetchAllOrders();
    return response;
    return;
  } catch (error) {
    return error;
  }
};
export const getLeverage = async (): Promise<any> => {
  try {
    const multiExchange = new CommonExchangeAPI(
      "binance",
      "a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50",
      "ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89",
      true
    );

    const response = await multiExchange.getLeverage();
    return response;
    return;
  } catch (error) {
    return error;
  }
};
export const setLeverage = async (symbol, leverage): Promise<any> => {
  try {
    const multiExchange = new CommonExchangeAPI(
      "binance",
      "a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50",
      "ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89",
      true
    );

    const response = await multiExchange.setLeverage(symbol, leverage);
    return response;
  } catch (error) {
    return error;
  }
};
export const placeOrder = async (
  symbol,
  type,
  side,
  quantity,
  price
): Promise<any> => {
  try {
    const multiExchange = new CommonExchangeAPI(
      "binance",
      "a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50",
      "ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89",
      true
    );

    const response = await multiExchange.placeOrder(
      symbol,
      type,
      side,
      quantity,
      price
    );
    return response;
  } catch (error) {
    return error;
  }
};
