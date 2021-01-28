"use strict";

let jsonConfig = {};

function addOrUpdateHeader(requestHeaders, headerName, headerValue) {
  for (let header of requestHeaders) {
    if (header.name.toLowerCase() === headerName) {
      header.value = headerValue;
      return;
    }
  }
  requestHeaders.push({name: headerName, value: headerValue})
}

function updateHeaders(requestHeaders) {
  for (let [headerName, headerValue] of Object.entries(jsonConfig)) {
    addOrUpdateHeader(requestHeaders.requestHeaders, headerName, headerValue);
  }
  return {requestHeaders: requestHeaders.requestHeaders};
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    updateHeaders,
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);

function updateHeadersToAlter(requestDetails) {
  console.log("Loading: " + requestDetails.url);
  let [_, queryString] = requestDetails.url.split("#", 2);
  for (let pair of queryString.split("&")) {
    let [key, value] = pair.split("=", 2);
    if (key === "config") {
      jsonConfig = JSON.parse(decodeURIComponent(value));
    }
  }
}

chrome.webRequest.onBeforeRequest.addListener(
    updateHeadersToAlter,
    {urls: ["https://extension.config/*"]},
    ["blocking"]
);

let ua = "mere";

/*
Update ua to a new value, mapped from the uaString parameter.
*/
function setUaString(uaString) {
  ua = uaString;
}
