/*
Copyright 2019 今日诗词

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// 今日诗词 V2 NPM-SDK 1.0.0
// 今日诗词API 是一个可以免费调用的诗词接口：https://www.jinrishici.com
import { DEFAULT_POEM_ARRAY, CONTENT_API_CONFIG } from './config'

// Extract Jinrishici logic into dedicated function
const loadFromJinrishici = (callback) => {
  const config = CONTENT_API_CONFIG.jinrishici;
  const keyName = config.tokenKey;
  
  if (window.localStorage && window.localStorage.getItem(keyName)) {
    return commonLoad(callback, window.localStorage.getItem(keyName), config);
  } else {
    return corsLoad(callback, config);
  }
};

// Add Hitokoto API integration function
const loadFromHitokoto = (callback, errorCallback) => {
  const config = CONTENT_API_CONFIG.hitokoto;
  const params = new URLSearchParams(config.params);
  const apiUrl = `${config.baseUrl}?${params.toString()}`;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(hitokoto => {
      // Transform Hitokoto response to ZenWaves format
      const zenWavesFormat = {
        status: "success",
        data: {
          content: hitokoto.hitokoto,
          origin: {
            author: hitokoto.from_who || "佚名",
            title: hitokoto.from || "未知作品"
          }
        },
        source: "hitokoto"
      };
      callback(zenWavesFormat);
    })
    .catch(error => {
      console.error('Hitokoto API failed:', error);
      if (errorCallback) errorCallback(error);
    });
};

// Enhanced main function with API selection and fallback
const loadPoem = (callback, options = {}) => {
  const { apiSource = 'jinrishici' } = options;
  
  if (apiSource === 'hitokoto') {
    loadFromHitokoto(callback, () => {
      // Fallback to Jinrishici if Hitokoto fails
      console.warn('Hitokoto API failed, falling back to Jinrishici');
      loadFromJinrishici(callback);
    });
  } else {
    // Default Jinrishici behavior
    loadFromJinrishici(callback);
  }
};

const corsLoad = (callback, config) => {
  const newCallBack = function (result) {
    window.localStorage.setItem(config.tokenKey, result.token);
    callback(result);
  };
  const apiUrl = `${config.baseUrl}${config.endpoint}?client=${config.clientId}`;
  return sendRequest(newCallBack, apiUrl, config);
};

const commonLoad = (callback, token, config) => {
  const apiUrl = `${config.baseUrl}${config.endpoint}?client=${config.clientId}&X-User-Token=${encodeURIComponent(token)}`;
  return sendRequest(callback, apiUrl, config);
};

const sendRequest = (callback, apiUrl, config) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', apiUrl);
  xhr.withCredentials = config.withCredentials;
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let data = xhr.responseText
        ? JSON.parse(xhr.responseText)
        : { errMessage: '无法获取诗词，请检查网络连接，正为您显示本地诗词...' };
      if (data.status === 'success') {
        callback(data);
      } else {
        console.error('今日诗词API加载失败，错误原因：' + data.errMessage);
        // 获取内置诗词，并展示
        const randomShici = DEFAULT_POEM_ARRAY[Math.floor(Math.random() * DEFAULT_POEM_ARRAY.length)];
        callback(randomShici);
      }
    }
  };
};

export default loadPoem
