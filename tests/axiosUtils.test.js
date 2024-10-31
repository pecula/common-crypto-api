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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
const axiosUtils_1 = require("../src/utils/axiosUtils");
const crypto = __importStar(require("crypto-js"));
describe('axiosUtils', () => {
    const mock = new axios_mock_adapter_1.default(axios_1.default);
    const apiKey = 'test-api-key';
    const apiSecret = 'test-api-secret';
    const url = 'https://api.test.com';
    const queryString = 'test=query';
    const proxyUrl = 'http://proxy.test.com';
    afterEach(() => {
        mock.reset();
    });
    describe('generateSignature', () => {
        it('should generate a valid HMAC SHA256 signature', () => {
            const signature = (0, axiosUtils_1.generateSignature)(queryString, apiSecret);
            expect(signature).toBe(crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex));
        });
    });
    describe('makeGetRequest', () => {
        it('should make a GET request and return response', () => __awaiter(void 0, void 0, void 0, function* () {
            const responseData = { data: 'test' };
            mock.onGet(url).reply(200, responseData);
            const response = yield (0, axiosUtils_1.makeGetRequest)(url, apiKey);
            expect(response.status).toBe(200);
            expect(response.data).toEqual(responseData);
        }));
        it('should throw an error if GET request fails', () => __awaiter(void 0, void 0, void 0, function* () {
            mock.onGet(url).reply(500);
            yield expect((0, axiosUtils_1.makeGetRequest)(url, apiKey)).rejects.toThrow('Request failed with status code 500');
        }));
        it('should make a GET request with proxy and return response', () => __awaiter(void 0, void 0, void 0, function* () {
            const responseData = { data: 'test' };
            mock.onGet(url).reply(200, responseData);
            const response = yield (0, axiosUtils_1.makeGetRequest)(url, apiKey, proxyUrl);
            expect(response.status).toBe(200);
            expect(response.data).toEqual(responseData);
        }));
    });
    describe('makePostRequest', () => {
        it('should make a POST request and return response', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestData = { key: 'value' };
            const responseData = { data: 'test' };
            mock.onPost(url, requestData).reply(200, responseData);
            const response = yield (0, axiosUtils_1.makePostRequest)(url, apiKey, requestData);
            expect(response.status).toBe(200);
            expect(response.data).toEqual(responseData);
        }));
        it('should throw an error if POST request fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const requestData = { key: 'value' };
            mock.onPost(url, requestData).reply(500);
            yield expect((0, axiosUtils_1.makePostRequest)(url, apiKey, requestData)).rejects.toThrow('Request failed with status code 500');
        }));
    });
});
