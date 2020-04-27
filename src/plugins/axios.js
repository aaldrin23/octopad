"use strict";

import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const ls = localStorage;

window.createAxios = (ip) => {
  let config = {
    baseURL:
      process.env.NODE_ENV == "development"
        ? `http://${ip}/api`
        : "http://octopi.local/api",
    timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
  };

  const _axios = axios.create(config);

  _axios.interceptors.request.use(
    function(config) {
      let api_key = (JSON.parse(ls.getItem("vuejs__api_key")) || {}).value;

      // Do something before request is sent
      config.headers = {
        "X-Api-Key": api_key,
      };
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  _axios.interceptors.response.use(
    function(response) {
      // Do something with response data
      return response;
    },
    function(error) {
      // Do something with response error
      return Promise.reject(error);
    }
  );

  window.axios = _axios;
};

let server_ip = (JSON.parse(ls.getItem("vuejs__server_ip")) || {}).value;

if (server_ip) {
  createAxios(server_ip);
}
