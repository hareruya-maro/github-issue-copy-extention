var url;
const targetUrlRegex = /^https:\/\/github.com\/(.+)\/(.+)\/issues\/([0-9]+).*$/;

var title = "";
var body = "";
var assignees = "";
var labels = "";
chrome.runtime.onMessage.addListener(function (
  request,
  _sender,
  _sendResponse
) {
  title = request.title;
  body = request.body;
  assignees = (request.assignees as string[]).join(",");
  labels = (request.labels as string[]).join(",");
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const result = tab.url?.match(targetUrlRegex);
    if (result && result?.length > 0) {
      chrome.contextMenus.update("copyIssue", {
        enabled: true,
      });
      chrome.tabs
        .sendMessage(tab.id!, {
          message: "hello!",
          url: tab.url,
        })
        .catch((e) => console.error(e));
    } else {
      title = "";
      chrome.contextMenus.update("copyIssue", {
        enabled: false,
      });
    }
  });
});

/**
 * 拡張機能インストール時の処理
 * インストール時のイベント関数で、コンテキストメニューを登録します。
 */
chrome.runtime.onInstalled.addListener(function () {
  var menuName = chrome.i18n.getMessage("MenuName");
  chrome.contextMenus.create({
    type: "normal",
    id: "copyIssue",
    title: menuName,
  });
  chrome.tabs.query({ active: true }, (tabs) => {
    const result = tabs[0].url?.match(targetUrlRegex);
    if (result && result?.length > 0) {
      chrome.contextMenus.update("copyIssue", {
        enabled: true,
      });
    } else {
      title = "";
      chrome.contextMenus.update("copyIssue", {
        enabled: false,
      });
    }
  });
});

/**
 * メニューが選択されたときの処理
 * 選択されたメニューが関数の引数に渡される。
 * 複数のメニューを登録した場合は、item.menuItemIdでクリックされたメニューが取得できる
 */
chrome.contextMenus.onClicked.addListener((_, tab) => {
  const result = tab?.url?.match(targetUrlRegex);
  if (result && result?.length > 0) {
    chrome.tabs.create({
      url: `https://github.com/${result[1]}/${result[2]}/issues/new?assignees=${assignees}&title=${title}&body=${body}&labels=${labels}`,
    });
  }
});
