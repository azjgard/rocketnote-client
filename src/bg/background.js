// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	chrome.pageAction.show(sender.tab.id);
	sendResponse();
});

//TODO:
//1. Pull latest notes at appropriate times