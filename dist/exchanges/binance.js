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
    fetchAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                throw error instanceof axios_1.AxiosError ? (_a = error.response) === null || _a === void 0 ? void 0 : _a.data : error;
            }
        });
    }
    parsePosition(position) {
        const entryPrice = position.entryPrice;
        if (entryPrice === '0' || entryPrice === '0.0' || entryPrice === '0.00000000') {
            return null;
        }
        const notional = Math.abs(parseFloat(position.notional));
        const contracts = parseFloat(position.positionAmt);
        const unrealizedPnl = parseFloat(position.unRealizedProfit);
        const leverage = parseInt(position.leverage);
        const liquidationPrice = parseFloat(position.liquidationPrice);
        const entryPriceFloat = parseFloat(position.entryPrice);
        const markPrice = parseFloat(position.markPrice);
        const collateral = Math.abs((contracts * entryPriceFloat) / leverage);
        const initialMargin = (contracts * entryPriceFloat) / leverage;
        const maintenanceMargin = contracts * markPrice * 0.004;
        const marginRatio = maintenanceMargin / collateral;
        const percentage = (unrealizedPnl / initialMargin) * 100;
        const timestamp = parseInt(position.updateTime);
        return {
            info: position,
            symbol: `${position.symbol.slice(0, -4)}/${position.symbol.slice(-4)}:USDT`,
            contracts,
            contractSize: 1,
            unrealizedPnl,
            leverage,
            liquidationPrice,
            collateral,
            notional,
            markPrice,
            entryPrice: entryPriceFloat,
            timestamp,
            initialMargin,
            initialMarginPercentage: 1 / leverage,
            maintenanceMargin,
            maintenanceMarginPercentage: 0.004,
            marginRatio,
            datetime: new Date(timestamp).toISOString(),
            marginMode: position.marginType,
            marginType: position.marginType,
            side: position.positionSide.toLowerCase(),
            hedged: true,
            percentage,
        };
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
                    const parsed = this.parsePosition(response.data[i]);
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
}
exports.Binance = Binance;
