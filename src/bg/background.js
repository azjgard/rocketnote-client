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
		api.getNotes().then(sendResponse);
		return true;
	} else if (request.type === 'getNotesByVideo') {
		api.getNotesByVideo(request.currentVideoId).then(sendResponse);
		return true;
	}

	if (request.type === 'storeNote') {
		api.storeNote(request.note).then(sendResponse);
		return true;
	} else if (request.type === 'sendFeedback') {
		api.sendFeedback(request.feedback).then(sendResponse);
		return true;
	} else if (request.type === 'getFeedback') {
		api.getFeedback().then(sendResponse);
		return true;
	}

	if (request.type === 'deleteNote') {
		api.deleteNote(request.noteId).then(sendResponse);
		return true;
	} else if (request.type === 'updateNote') {
		api.updateNote(request.note.id, request.note).then(sendResponse);
		return true;
	} else if (request.type === 'undoDelete') {
		api.storeNote(request.note).then(sendResponse);
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
	} else if (request.type === 'getNotes') {
		api.getNotes().then(sendResponse);
		return true;
	}
});