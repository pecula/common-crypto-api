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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bybit = void 0;
const axios_1 = __importDefault(require("axios"));
class Bybit {
    constructor(apiKey, apiSecret, testnet) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        if (testnet) {
            this.baseUrl = "https://testnet.bybit.com/fapi"; //correct the URL alter
        }
        else {
            this.baseUrl = "https://api.bybit.com";
        }
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            // Add logic to fetch the balance from Bybit
            return yield axios_1.default.get(`${this.baseUrl}/v2/private/wallet/balance`, {
                headers: {
                    "X-BYBIT-APIKEY": this.apiKey,
                },
            });
        });
    }
    getLeverage() {
        return __awaiter(this, void 0, void 0, function* () {
            // Add logic to fetch the balance from Bybit
            return yield axios_1.default.get(`${this.baseUrl}/v2/private/wallet/balance`, {
                headers: {
                    "X-BYBIT-APIKEY": this.apiKey,
                },
            });
        });
    }
    setLeverage(symbol, leverage) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add logic to fetch the balance from Bybit
            return yield axios_1.default.get(`${this.baseUrl}/v2/private/wallet/balance`, {
                headers: {
                    "X-BYBIT-APIKEY": this.apiKey,
                },
            });
        });
    }
    fetchAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`${this.baseUrl}/v2/private/wallet/balance`, {
                headers: {
                    "X-BYBIT-APIKEY": this.apiKey,
                },
            });
        });
    }
    placeOrder(symbol, type, side, quantity, price) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add logic to place an order on Bybit
            return yield axios_1.default.post(`${this.baseUrl}/v2/private/order/create`, { symbol, side, qty: quantity, price }, {
                headers: {
                    "X-BYBIT-APIKEY": this.apiKey,
                },
            });
        });
    }
}
exports.Bybit = Bybit;
