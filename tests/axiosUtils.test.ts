import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { generateSignature, makeGetRequest, makePostRequest } from '../src/utils/axiosUtils';
import * as crypto from 'crypto-js';

describe('axiosUtils', () => {
  const mock = new MockAdapter(axios);
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
      const signature = generateSignature(queryString, apiSecret);
      expect(signature).toBe(crypto.HmacSHA256(queryString, apiSecret).toString(crypto.enc.Hex));
    });
  });

  describe('makeGetRequest', () => {
    it('should make a GET request and return response', async () => {
      const responseData = { data: 'test' };
      mock.onGet(url).reply(200, responseData);

      const response = await makeGetRequest(url, apiKey);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
    });

    it('should throw an error if GET request fails', async () => {
      mock.onGet(url).reply(500);

      await expect(makeGetRequest(url, apiKey)).rejects.toThrow('Request failed with status code 500');
    });

    it('should make a GET request with proxy and return response', async () => {
      const responseData = { data: 'test' };
      mock.onGet(url).reply(200, responseData);

      const response = await makeGetRequest(url, apiKey, proxyUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
    });
  });

  describe('makePostRequest', () => {
    it('should make a POST request and return response', async () => {
      const requestData = { key: 'value' };
      const responseData = { data: 'test' };
      mock.onPost(url, requestData).reply(200, responseData);

      const response = await makePostRequest(url, apiKey, requestData);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
    });

    it('should throw an error if POST request fails', async () => {
      const requestData = { key: 'value' };
      mock.onPost(url, requestData).reply(500);

      await expect(makePostRequest(url, apiKey, requestData)).rejects.toThrow('Request failed with status code 500');
    });
  });
});
