"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonExchangeAPI = void 0;
const binance_1 = require("./exchanges/binance");
const bybit_1 = require("./exchanges/bybit");
class CommonExchangeAPI {
    constructor(exchange, apiKey, apiSecret, testnet, proxyUrl) {
        switch (exchange) {
            case "binance":
                this.exchange = new binance_1.Binance(apiKey, apiSecret, testnet, proxyUrl);
                break;
            case "bybit":
                this.exchange = new bybit_1.Bybit(apiKey, apiSecret, testnet, proxyUrl);
                break;
            default:
                throw new Error("Unsupported exchange");
        }
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.getBalance();
        });
    }
    setLeverage(symbol, leverage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.setLeverage(symbol, leverage);
        });
    }
    placeOrder(pair, type, side, amount, price, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.placeOrder(pair, type, side, amount, price, params);
        });
    }
    setPositionMode(mode, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.setPositionMode(mode, symbol);
        });
    }
    setMarginMode(mode, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.setMarginMode(mode, symbol);
        });
    }
}
exports.CommonExchangeAPI = CommonExchangeAPI;
