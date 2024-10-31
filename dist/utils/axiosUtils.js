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
exports.makeRequest = void 0;
// src/utils/axiosUtils.ts
const axios_1 = __importStar(require("axios"));
const https_proxy_agent_1 = require("https-proxy-agent");
const makeRequest = (method_1, url_1, ...args_1) => __awaiter(void 0, [method_1, url_1, ...args_1], void 0, function* (method, url, data = {}, proxyUrl, headers = {}) {
    try {
        let axiosInstance = axios_1.default;
        if (proxyUrl) {
            const agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
            axiosInstance = axios_1.default.create({
                baseURL: url,
                httpsAgent: agent,
                timeout: 10000,
            });
        }
        const response = yield axiosInstance({
            method,
            url,
            headers: Object.assign({}, headers),
            data: method === "post" ? data : undefined,
        });
        return response;
    }
    catch (error) {
        throw error instanceof axios_1.AxiosError
            ? error
            : new Error(`Unable to make ${method.toUpperCase()} request`);
    }
});
exports.makeRequest = makeRequest;
