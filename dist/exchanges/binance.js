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
const axios_1 = require("axios");
const axiosUtils_1 = require("../utils/axiosUtils");
const crypto = __importStar(require("crypto-js"));
const prase_binance_1 = require("./formatted/prase_binance");
class Binance {
    constructor(apiKey, apiSecret, testnet, proxyUrl) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        if (testnet) {
            this.baseUrl = 'https://testnet.binancefuture.com';
        }
        else {
            this.baseUrl = 'https://fapi.binance.com';
        }
        this.proxyUrl = proxyUrl;
    }
    generateSignature(queryString, apiSecret) {
        return crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex);
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
            }
        });
    }
    setLeverage(symbol, leverage) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                    throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
                }
            }
        });
    }
    fetchClosedOrders(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const timestamp = Date.now();
                const queryString = `timestamp=${timestamp}`;
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}/fapi/v1/allOrders?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('get', url, {}, this.proxyUrl, headers);
                if (symbol != "") {
                    response.data = response.data.filter((elem) => {
                        return elem.symbol == symbol;
                    });
                }
                const result = [];
                for (let i = 0; i < response.data.length; i++) {
                    const parsed = (0, prase_binance_1.parseAllOrders)(response.data[i]);
                    if (parsed !== null) {
                        result.push(parsed);
                    }
                }
                return result;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
            }
            /*
            [
           {
             info: {
               orderId: '4066137237',
               symbol: 'BTCUSDT',
               status: 'FILLED',
               clientOrderId: 'web_AAnDicEckiUFMDO2xLRe',
               price: '0',
               avgPrice: '90369.70000',
               origQty: '0.002',
               executedQty: '0.002',
               cumQuote: '180.73940',
               timeInForce: 'GTC',
               type: 'MARKET',
               reduceOnly: false,
               closePosition: false,
               side: 'BUY',
               positionSide: 'BOTH',
               stopPrice: '0',
               workingType: 'CONTRACT_PRICE',
               priceMatch: 'NONE',
               selfTradePreventionMode: 'NONE',
               goodTillDate: '0',
               priceProtect: false,
               origType: 'MARKET',
               time: '1731382930786',
               updateTime: '1731382930786'
             },
             id: '4066137237',
             clientOrderId: 'web_AAnDicEckiUFMDO2xLRe',
             timestamp: 1731382930786,
             datetime: '2024-11-12T03:42:10.786Z',
             lastTradeTimestamp: 1731382930786,
             lastUpdateTimestamp: 1731382930786,
             symbol: 'BTC/USDT:USDT',
             type: 'market',
             timeInForce: 'GTC',
             postOnly: false,
             reduceOnly: false,
             side: 'buy',
             price: 90369.7,
             triggerPrice: undefined,
             amount: 0.002,
             cost: 180.7394,
             average: 90369.7,
             filled: 0.002,
             remaining: 0,
             status: 'closed',
             fee: undefined,
             trades: [],
             fees: [],
             stopPrice: undefined,
             takeProfitPrice: undefined,
             stopLossPrice: undefined
           }
         ]
            */
        });
    }
    fetchPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const timestamp = Date.now();
                const endpoint = '/fapi/v2/positionRisk';
                const queryString = `timestamp=${timestamp}`;
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('get', url, {}, this.proxyUrl, headers);
                // Example response:
                //   {
                //     "symbol": "ETHUSDT",
                //     "positionAmt": "-0.010",
                //     "entryPrice": "2468.49",
                //     "breakEvenPrice": "2467.255755",
                //     "markPrice": "2473.15992704",
                //     "unRealizedProfit": "-0.04669927",
                //     "liquidationPrice": "2949.15712649",
                //     "leverage": "5",
                //     "maxNotionalValue": "320000000",
                //     "marginType": "isolated",
                //     "isolatedMargin": "4.87793828",
                //     "isAutoAddMargin": "false",
                //     "positionSide": "SHORT",
                //     "notional": "-24.73159927",
                //     "isolatedWallet": "4.92463755",
                //     "updateTime": "1730667935892",
                //     "isolated": true,
                //     "adlQuantile": "1"
                // }
                const result = [];
                for (let i = 0; i < response.data.length; i++) {
                    const parsed = (0, prase_binance_1.parsePosition)(response.data[i]);
                    if (parsed !== null) {
                        result.push(parsed);
                    }
                }
                return result;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
            }
        });
    }
    createOrder(pair, type, side, amount, price, params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const sideCase = side.toUpperCase();
                const timestamp = Date.now();
                let queryString = `symbol=${pair}&side=${sideCase}&type=${type}&quantity=${amount}&timestamp=${timestamp}`;
                if (type == 'limit') {
                    if (price) {
                        queryString += `&price=${price}`;
                    }
                    else {
                        throw new Error('Price is required for limit orders');
                    }
                }
                if (params) {
                    for (const [key, value] of Object.entries(params)) {
                        queryString += `&${key}=${value}`;
                    }
                }
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}/fapi/v1/order?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('post', url, {}, this.proxyUrl, headers);
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
            }
        });
    }
    // mode: 'true' for Hedge Mode, 'false' for One-way Mode
    setPositionMode(mode, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const timestamp = Date.now();
                const endpoint = '/fapi/v1/positionSide/dual';
                const queryString = `symbol=${symbol}&dualSidePosition=${mode}&timestamp=${timestamp}`;
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('post', url, {}, this.proxyUrl, headers);
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
            }
        });
    }
    setMarginMode(mode, symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const timestamp = Date.now();
                const modeCase = mode == 'cross' ? 'CROSSED' : mode.toUpperCase();
                const endpoint = '/fapi/v1/marginType';
                const queryString = `symbol=${symbol}&marginType=${modeCase}&timestamp=${timestamp}`;
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}${endpoint}?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('post', url, {}, this.proxyUrl, headers);
                return response.data;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
            }
        });
    }
    fetchTradeHistory(symbol, orderId, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const timestamp = Date.now();
                let queryString = `symbol=${symbol}&timestamp=${timestamp}`;
                if (orderId) {
                    queryString += `&orderId=${orderId}`;
                }
                if (startTime) {
                    queryString += `&startTime=${startTime}`;
                }
                if (endTime) {
                    queryString += `&endTime=${endTime}`;
                }
                const signature = this.generateSignature(queryString, this.apiSecret);
                const url = `${this.baseUrl}/fapi/v1/userTrades?${queryString}&signature=${signature}`;
                const headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
                const response = yield (0, axiosUtils_1.makeRequest)('get', url, {}, this.proxyUrl, headers);
                // Example response:
                //   [
                //     {
                //       symbol: 'ETHUSDT',
                //       id: 129990184,
                //       orderId: 1467650881,
                //       side: 'BUY',
                //       price: '2549',
                //       qty: '0.208',
                //       realizedPnl: '0',
                //       quoteQty: '530.19200',
                //       commission: '0.21207680',
                //       commissionAsset: 'USDT',
                //       time: 1730763011865,
                //       positionSide: 'LONG',
                //       maker: false,
                //       buyer: true
                //     }
                //   ]
                const result = [];
                for (let i = 0; i < response.data.length; i++) {
                    const parsed = (0, prase_binance_1.parseTrade)(response.data[i]);
                    result.push(parsed);
                }
                return result;
            }
            catch (error) {
                throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
            }
        });
    }
}
exports.Binance = Binance;
