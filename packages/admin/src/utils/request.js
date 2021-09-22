const axios = require('axios');
const CryptoJS = require('crypto-js');
const https = require('https');
const { toaster } = require('baseui/toast');

const request = axios.create({ baseURL: 'https://realfoodtw.com' });

request.interceptors.response.use(
  (response) => response,
  (error) => {
    // Customize error handling
    toaster.negative(error.response.data);
    return Promise.reject(error);
  }
);

export { request };
