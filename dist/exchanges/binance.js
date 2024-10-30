"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Binance = void 0;
const axios_1 = __importStar(require("axios"));
const crypto = __importStar(require("crypto-js"));
class Binance {
    constructor(apiKey, apiSecret, testnet) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        if (testnet) {
            this.baseUrl = "https://testnet.binancefuture.com/fapi";
        }
        else {
            this.baseUrl = "https://api.binance.com/api/v3/account";
        }
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const queryString = `timestamp=${timestamp}`;
                // Generate HMAC SHA256 signature
                const signature = crypto
                    .HmacSHA256(queryString, this.apiSecret)
                    .toString(crypto.enc.Hex);
                this.baseUrl = `${this.baseUrl}/v3/balance?${queryString}&signature=${signature}`;
                // Add logic to fetch the balance from Binance
                const response = yield axios_1.default.get(`${this.baseUrl}`, {
                    headers: {
                        "X-MBX-APIKEY": this.apiKey,
                    },
                });
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError
                    ? error.message
                    : "unable to fetch balance";
            }
        });
    }
    getLeverage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const queryString = `timestamp=${timestamp}`;
                // Generate HMAC SHA256 signature
                const signature = crypto
                    .HmacSHA256(queryString, this.apiSecret)
                    .toString(crypto.enc.Hex);
                this.baseUrl = `${this.baseUrl}/v1/leverageBracket?${queryString}&signature=${signature}`;
                const response = yield axios_1.default.get(`${this.baseUrl}`, {
                    headers: {
                        "X-MBX-APIKEY": this.apiKey,
                    },
                });
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError
                    ? error.message
                    : "unable to fetch leverage";
            }
        });
    }
    setLeverage(symbol, leverage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const queryString = `symbol=${symbol}&leverage=${leverage}&timestamp=${timestamp}`;
                // Generate HMAC SHA256 signature
                const signature = crypto
                    .HmacSHA256(queryString, this.apiSecret)
                    .toString(crypto.enc.Hex);
                this.baseUrl = `${this.baseUrl}/v1/leverage?${queryString}&signature=${signature}`;
                console.log(this.baseUrl);
                const response = yield axios_1.default.post(this.baseUrl, {}, {
                    headers: {
                        "X-MBX-APIKEY": this.apiKey,
                    },
                });
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error : "unable to set leverage";
            }
        });
    }
    fetchAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const queryString = `timestamp=${timestamp}`;
                // Generate HMAC SHA256 signature
                const signature = crypto
                    .HmacSHA256(queryString, this.apiSecret)
                    .toString(crypto.enc.Hex);
                this.baseUrl = `${this.baseUrl}/v1/allOrders?${queryString}&signature=${signature}`;
                // Add logic to fetch the balance from Binance
                const response = yield axios_1.default.get(`${this.baseUrl}`, {
                    headers: {
                        "X-MBX-APIKEY": this.apiKey,
                    },
                });
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError
                    ? error.message
                    : "unable to fetch all orders";
            }
        });
    }
    placeOrder(pair, type, side, amount, price, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const queryString = `symbol=${pair}&side=${side}&quantity=${amount}&timestamp=${timestamp}`;
                const signature = crypto
                    .HmacSHA256(queryString, this.apiSecret)
                    .toString(crypto.enc.Hex);
                // Add logic to place an order on Binance
                return yield axios_1.default.post(`${this.baseUrl}/api/v1/order`, {}, {
                    headers: {
                        "X-MBX-APIKEY": this.apiKey,
                    },
                });
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error : "unable to place order";
            }
        });
    }
}
exports.Binance = Binance;
