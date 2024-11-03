import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { makeRequest } from '../src/utils/axiosUtils';
import { HttpsProxyAgent } from 'https-proxy-agent';

describe('axiosUtils', () => {
  const mock = new MockAdapter(axios);
  const url = 'https://api.test.com';
  const proxyUrl = 'http://proxy.test.com';
  const headers = { 'Content-Type': 'application/json' };

  afterEach(() => {
    mock.reset();
  });

  describe('makeRequest', () => {
    it('should make a GET request successfully', async () => {
      const responseData = { success: true };
      mock.onGet(url).reply(200, responseData);

      const response = await makeRequest('get', url, {}, undefined, headers);
      expect(response.data).toEqual(responseData);
    });

    it('should make a POST request successfully', async () => {
      const responseData = { success: true };
      const postData = { key: 'value' };
      mock.onPost(url).reply(200, responseData);

      const response = await makeRequest('post', url, postData, undefined, headers);
      expect(response.data).toEqual(responseData);
    });

    it('should make a GET request with proxy successfully', async () => {
      const responseData = { success: true };
      mock.onGet(url).reply(200, responseData);

      const response = await makeRequest('get', url, {}, proxyUrl, headers);
      expect(response.data).toEqual(responseData);
    });

    it('should make a POST request with proxy successfully', async () => {
      const responseData = { success: true };
      const postData = { key: 'value' };
      mock.onPost(url).reply(200, responseData);

      const response = await makeRequest('post', url, postData, proxyUrl, headers);
      expect(response.data).toEqual(responseData);
    });

    it('should handle request errors', async () => {
      mock.onGet(url).reply(500);

      await expect(makeRequest('get', url, {}, undefined, headers)).rejects.toThrow();
    });
  });
});