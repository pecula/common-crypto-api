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
exports.Binance = void 0;
const axios_1 = require("axios");
const axiosUtils_1 = require("../utils/axiosUtils");
const crypto_js_1 = __importDefault(require("crypto-js"));
class Binance {
    constructor(apiKey, apiSecret, testnet, proxyUrl) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        if (testnet) {
            this.baseUrl = 'https://testnet.binancefuture.com/fapi';
        }
        else {
            this.baseUrl = 'https://fapi.binance.com';
        }
        this.proxyUrl = proxyUrl;
    }
    generateSignature(queryString, apiSecret) {
        return crypto_js_1.default.HmacSHA256(queryString, apiSecret).toString(crypto_js_1.default.enc.Hex);
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const endpoint = '/fapi/v3/balance';
                const queryString = `timestamp=${timestamp}`;
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('get', url, {}, this.proxyUrl, headers);
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error.message : 'Unable to fetch balance';
            }
        });
    }
    setLeverage(symbol, leverage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const endpoint = '/fapi/v1/leverage';
                let queryString = `symbol=${symbol}&leverage=${leverage}&timestamp=${timestamp}`;
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('post', url, {}, this.proxyUrl, headers);
                return response.data;
            }
            catch (error) {
                if (error instanceof axios_1.AxiosError && error.response) {
                    console.error('Error message:', error.response.data.msg);
                    throw new Error(error.response.data.msg);
                }
                else {
                    throw error;
                }
            }
        });
    }
    fetchAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const queryString = `timestamp=${timestamp}`;
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}/v1/allOrders?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('get', url, {}, this.proxyUrl, headers);
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error.message : 'Unable to fetch all orders';
            }
        });
    }
    placeOrder(pair, type, side, amount, price, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const queryString = `symbol=${pair}&side=${side}&quantity=${amount}&timestamp=${timestamp}`;
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}/api/v1/order?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                return yield (0, axiosUtils_1.makeRequest)('post', url, {}, this.proxyUrl, headers);
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error.message : 'Unable to place order';
            }
        });
    }
}
exports.Binance = Binance;
