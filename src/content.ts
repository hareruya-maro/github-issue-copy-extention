// tabのURLが変わったらbackground.tsにメッセージ送信する
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'hello!') {
            const titleElement = document.querySelector("#partial-discussion-header > div.gh-header-show > div > h1 > span.js-issue-title.markdown-title")
            const bodyElement = document.getElementsByName('issue[body]');
            const assigneeList = document.querySelectorAll("#partial-discussion-sidebar > div.discussion-sidebar-item.sidebar-assignee.js-discussion-sidebar-item > form > span > p > span > a.assignee.Link--primary > span")
            const labelsList = document.querySelectorAll("#partial-discussion-sidebar > div:nth-child(2) > div > a > span")

            let title = '';
            let body = '';
            let assignees: string[] = [];
            let labels: string[] = [];
            if (titleElement && titleElement.textContent) {
                title = encodeURI(titleElement.textContent.trim());
            }
            if (bodyElement.length > 0 && bodyElement[0].textContent) {
                body = encodeURI(bodyElement[0].textContent).replace(/#/g, '%23');
            }
            if (assigneeList && assigneeList.length > 0) {
                assigneeList.forEach(node => {
                    if (node.textContent) {
                        assignees.push(node.textContent)
                    }
                })
            }
            if (labelsList && labelsList.length > 0) {
                labelsList.forEach(node => {
                    if (node.textContent) {
                        labels.push(node.textContent)
                    }
                })
            }
            chrome.runtime.sendMessage({
                title, body, assignees, labels
            });
        }
    }
);
