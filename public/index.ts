import { CommonExchangeAPI } from "../src/index";

const getBalance = async (): Promise<any> => {
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

console.log(getBalance());

