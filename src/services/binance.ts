import axios, { AxiosResponse, AxiosError } from 'axios';
import * as crypto from 'crypto-js'; // Import crypto-js for HMAC signing

export interface BalanceResponse {
    // Add any fields you expect from the Binance API response
}

export interface OrderResponse {
    // Add any fields you expect from the order placement response
}

export class Binance {
    private apiKey: string;
    private apiSecret: string;
    private url: string;
    private testnet: boolean;

    constructor(apiKey: string, apiSecret: string, testnet: boolean) {
        this.testnet = testnet;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        if (this.testnet) {
            this.url = 'https://testnet.binancefuture.com/fapi';
        } else {
            this.url = 'https://api.binance.com/api/v3/account';
        }
    }
    public async getBalance(): Promise<Object[]> {
        try {
            const timestamp = Date.now();
            const queryString = `timestamp=${timestamp}`;
            // Generate HMAC SHA256 signature
            const signature = crypto.HmacSHA256(queryString, this.apiSecret).toString(crypto.enc.Hex);
            this.url = `${this.url}/v3/balance?${queryString}&signature=${signature}`;

            // Add logic to fetch the balance from Binance
            const response = await axios.get(`${this.url}`, {
                headers: {
                    'X-MBX-APIKEY': this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            throw error instanceof AxiosError ? error.message : 'unable to fetch balance';

        }
    }
    public async getLeverage(): Promise<Object[]> {
        try {
            const timestamp = Date.now();
            const queryString = `timestamp=${timestamp}`;
            // Generate HMAC SHA256 signature
            const signature = crypto.HmacSHA256(queryString, this.apiSecret).toString(crypto.enc.Hex);
            this.url = `${this.url}/v1/leverageBracket?${queryString}&signature=${signature}`;

            const response = await axios.get(`${this.url}`, {
                headers: {
                    'X-MBX-APIKEY': this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            throw error instanceof AxiosError ? error.message : 'unable to fetch leverage';

        }
    }
    public async setLeverage(symbol: string, leverage: number): Promise<Object[]> {
        try {
            const timestamp = Date.now();
            const queryString = `symbol=${symbol}&leverage=${leverage}&timestamp=${timestamp}`;
            // Generate HMAC SHA256 signature
            const signature = crypto.HmacSHA256(queryString, this.apiSecret).toString(crypto.enc.Hex);
            this.url = `${this.url}/v1/leverage?${queryString}&signature=${signature}`;

            console.log(this.url);
            const response = await axios.post(this.url, {}, {
                headers: {
                    'X-MBX-APIKEY': this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            throw error instanceof AxiosError ? error : 'unable to set leverage';
        }
    }
    public async fetchAllOrders(): Promise<Object[]> {
        try {
            const timestamp = Date.now();
            const queryString = `timestamp=${timestamp}`;
            // Generate HMAC SHA256 signature
            const signature = crypto.HmacSHA256(queryString, this.apiSecret).toString(crypto.enc.Hex);
            this.url = `${this.url}/v1/allOrders?${queryString}&signature=${signature}`;

            // Add logic to fetch the balance from Binance
            const response = await axios.get(`${this.url}`, {
                headers: {
                    'X-MBX-APIKEY': this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            throw error instanceof AxiosError ? error.message : 'unable to fetch all orders';

        }
    }
    public async placeOrder(symbol: string, type: string, side: string, quantity: number, price: number): Promise<AxiosResponse<OrderResponse>> {
        try {
            const timestamp = Date.now();
            const queryString = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`;
            const signature = crypto.HmacSHA256(queryString, this.apiSecret).toString(crypto.enc.Hex);
            // Add logic to place an order on Binance
            return await axios.post(`${this.url}/api/v1/order`, {},
                {
                    headers: {
                        'X-MBX-APIKEY': this.apiKey,
                    },
                }
            );
        } catch (error) {
            throw error instanceof AxiosError ? error : 'unable to place order';

        }
    }
}
