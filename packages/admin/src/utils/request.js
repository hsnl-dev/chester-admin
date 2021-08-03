const axios = require("axios")
const CryptoJS = require("crypto-js");
const https = require("https")
const { toaster }=require('baseui/toast');

const request = axios.create({baseURL: "http://localhost:8000"});

request.interceptors.response.use(
  response => response,
  error => {
    // Customize error handling
    toaster.negative(error.response.data)
    return Promise.reject(error);
  },
);
/*
const tenlifeRequest=axios.create({ baseURL: "https://wutau.freshio.me" });

tenlifeRequest.interceptors.request.use((config)=>{
    // Do something before request is sent
    const sortedParams=Object.keys(config.params).sort((a,b)=>a.localeCompare(b, 'es', { sensitivity: 'base' }))
    .map(key=>`${key}=${config.params[key]}`)
    .join("&")
    
    config.params={
      ...config.params, 
      sign: CryptoJS.SHA256(`${sortedParams}${config.headers["Authorization"]}`).toString(CryptoJS.enc.Hex)
    }

    config.headers={
      ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
*/
export {
    request
    //tenlifeRequest
}