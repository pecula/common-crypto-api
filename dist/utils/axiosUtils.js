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
exports.makeRequest = void 0;
// src/utils/axiosUtils.ts
const axios_1 = __importDefault(require("axios"));
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
            //   data: method === "post" ? data : undefined,
        });
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.makeRequest = makeRequest;
