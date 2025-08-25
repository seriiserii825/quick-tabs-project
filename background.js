// script start after extension install
chrome.runtime.onInstalled.addListener(async () => {
    console.log("extension installed");
});
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});
