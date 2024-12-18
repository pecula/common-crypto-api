# common-crypto-api

common-crypto-api is a Node.js package that provides a unified API to interact with multiple cryptocurrency exchanges. This package simplifies the process of integrating with different exchange APIs by offering a common interface.

## Features

- Unified API for multiple exchanges
- Supports Binance and Bybit exchanges
- Fetch balance, leverage, orders, and place orders
- Testnet support for exchange
- Proxy URL support for exchange ratelimit

## Installation

```sh
npm install common-crypto-api
```

## Usage

### Importing the Module

```ts
import { CommonExchangeAPI } from "common-crypto-api";
```

### Creating an Instance

```ts
const commonExchangeAPI = new CommonExchangeAPI(
  "binance", // or "bybit"
  "your-api-key",
  "your-api-secret",
  true // true for testnet, false for mainnet
);
```

### Fetching Balance

```ts
const balance = await commonExchangeAPI.getBalance();
console.log(balance);
```

### Fetching All Orders

```ts
const orders = await commonExchangeAPI.fetchAllOrders();
console.log(orders);
```

### Fetching Leverage

```ts
const leverage = await commonExchangeAPI.getLeverage();
console.log(leverage);
```

### Setting Leverage

```ts
const response = await commonExchangeAPI.setLeverage("BTCUSDT", 10);
console.log(response);
```

### Placing an Order

```ts
const order = await commonExchangeAPI.createOrder(
  "BTCUSDT",
  "limit",
  "buy",
  1,
  50000
);
console.log(order);
```

## Development

### Building the Project

```sh
npm run build
```

### Running in Development Mode

```sh
npm run dev
```

## License

This project is licensed under the ISC License. See the 

LICENSE

 file for details.

## Authors

- Ramkumar R
- Vivek

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Acknowledgements

- [axios](https://github.com/axios/axios)
- [crypto-js](https://github.com/brix/crypto-js)