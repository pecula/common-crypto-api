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
exports.Bybit = void 0;
const axios_1 = require("axios");
const axiosUtils_1 = require("../utils/axiosUtils");
const crypto = __importStar(require("crypto-js"));
class Bybit {
    constructor(apiKey, apiSecret, testnet, proxyUrl) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        if (testnet) {
            this.baseUrl = 'https://api-testnet.bybit.com';
        }
        else {
            this.baseUrl = 'https://api.bybit.com';
        }
        this.proxyUrl = proxyUrl;
    }
    generateSign(queryString, apiSecret) {
        return crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
    }
    generateSignature(params) {
        const orderedParams = Object.keys(params)
            .sort()
            .reduce((obj, key) => {
            obj[key] = params[key];
            return obj;
        }, {});
        const queryString = Object.keys(orderedParams)
            .map((key) => `${key}=${orderedParams[key]}`)
            .join('&');
        return this.generateSign(queryString, this.apiSecret);
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const params = { api_key: this.apiKey, timestamp: timestamp.toString() };
                const signature = this.generateSignature(params);
                const url = `${this.baseUrl}/v2/private/wallet/balance?${new URLSearchParams(params).toString()}&sign=${signature}`;
                const headers = {
                    "X-MBX-APIKEY": this.apiKey, // correct the header later
                };
                const response = yield (0, axiosUtils_1.makeRequest)('get', url, {}, this.proxyUrl, headers);
                return response;
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
                const params = { api_key: this.apiKey, symbol, leverage: leverage.toString(), timestamp: timestamp.toString() };
                const signature = this.generateSignature(params);
                const url = `${this.baseUrl}/v2/private/position/leverage/save?${new URLSearchParams(params).toString()}&sign=${signature}`;
                const response = yield (0, axiosUtils_1.makeRequest)('post', url, {}, this.proxyUrl);
                return response;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error.message : 'Unable to set leverage';
            }
        });
    }
    fetchAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const params = { api_key: this.apiKey, timestamp: timestamp.toString() };
                const signature = this.generateSignature(params);
                const url = `${this.baseUrl}/v2/private/order/list?${new URLSearchParams(params).toString()}&sign=${signature}`;
                const response = yield (0, axiosUtils_1.makeRequest)('get', url, {}, this.proxyUrl);
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error.message : 'Unable to fetch all orders';
            }
        });
    }
    placeOrder(symbol, type, side, quantity, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const params = {
                    api_key: this.apiKey,
                    symbol,
                    side,
                    qty: quantity.toString(),
                    price: price.toString(),
                    timestamp: timestamp.toString()
                };
                const signature = this.generateSignature(params);
                const url = `${this.baseUrl}/v2/private/order/create?${new URLSearchParams(params).toString()}&sign=${signature}`;
                const response = yield (0, axiosUtils_1.makeRequest)('post', url, {}, this.proxyUrl);
                return response;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error.message : 'Unable to place order';
            }
        });
    }
    // mode: 'true' for Hedge Mode, 'false' for One-way Mode
    setPositionMode(mode, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const endpoint = '/fapi/v1/positionSide/dual';
                const params = {
                    api_key: this.apiKey,
                    symbol,
                    mode,
                    timestamp: timestamp.toString()
                };
                const signature = this.generateSignature(params);
                const url = `${this.baseUrl}${endpoint}?${new URLSearchParams(params).toString()}&sign=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('post', url, {}, this.proxyUrl, headers);
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error.message : 'Unable to set position mode';
            }
        });
    }
    setMarginMode(mode, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Date.now();
                const params = { api_key: this.apiKey, symbol, mode, timestamp: timestamp.toString() };
                const signature = this.generateSignature(params);
                const url = `${this.baseUrl}/v2/private/position/switch-isolated?${new URLSearchParams(params).toString()}&sign=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)("post", url, {}, this.proxyUrl, headers);
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? error.message : "Unable to set margin mode";
            }
        });
    }
}
exports.Bybit = Bybit;
