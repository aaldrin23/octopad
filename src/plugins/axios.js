"use strict";

import axios from "axios";

const ls = localStorage;

const getLs = function(key) {
  const item = JSON.parse(ls.getItem(`vuejs__${key}`));
  return (item || {}).value;
};

window.createAxios = (ip) => {
  let config = {
    baseURL: `http://${ip}/api`,
    timeout: 60 * 1000,
  };

  const _axios = axios.create(config);

  _axios.interceptors.request.use(
    function(config) {
      let api_key = getLs("api_key");

      config.headers = {
        "X-Api-Key": api_key,
      };
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );

  _axios.interceptors.response.use(
    function(response) {
      return response;
    },
    function(error) {
      return Promise.reject(error);
    }
  );

  window.axios = _axios;
};

const server_ip = getLs("server_ip");

if (server_ip) {
  createAxios(server_ip);
}
