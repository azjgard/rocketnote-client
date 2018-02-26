const PROD = false;

const baseUrl = "https://api.getrocketnote.com/v1";

this.userLoggedIn = null;

(async function () {
	this.userLoggedIn = await getAuthToken() ? true : false;
})();

// Weird notes to self:
// -- don't declare an async function here because it breaks sendResponse
// -- if any asynchronous code is run in this function, be sure
// to return true so that the sendResponse listener doesn't close

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	if (request.type === 'getState') {
		if (!this.userLoggedIn) {
			sendResponse(false);
		}
		else {
			api.getProfile().then(sendResponse);
			return true;
		}
	}

	if (request.type === 'login') {
		login(true).then(() => {
			this.userLoggedIn = true;
		});
	}
	else if (request.type === 'logout') {
		logout().then(() => {
			this.userLoggedIn = false;
			sendResponse(false);
		});
		return true;
	}

	if (request.type === 'getNotes') {

	}
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
	if (request.type === 'identity') {
		if (!this.userLoggedIn) {
			sendResponse(false);
		} else {
			api.getProfile().then(sendResponse);
			return true;
		}
	}
});