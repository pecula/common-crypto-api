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
exports.MultiExchangeAPI = void 0;
const binance_1 = require("./binance");
const bybit_1 = require("./bybit");
class MultiExchangeAPI {
    constructor(exchange, apiKey, apiSecret, testnet) {
        switch (exchange) {
            case "binance":
                this.exchange = new binance_1.Binance(apiKey, apiSecret, testnet);
                break;
            case "bybit":
                this.exchange = new bybit_1.Bybit(apiKey, apiSecret);
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
    fetchAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.fetchAllOrders();
        });
    }
    getLeverage() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.getLeverage();
        });
    }
    setLeverage(symbol, leverage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.setLeverage(symbol, leverage);
        });
    }
    placeOrder(symbol, type, side, quantity, price) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.exchange.placeOrder(symbol, type, side, quantity, price);
        });
    }
}
exports.MultiExchangeAPI = MultiExchangeAPI;
