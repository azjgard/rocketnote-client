const PROD = false;

const baseUrl = "https://api.getrocketnote.com/v1";

this.userLoggedIn = null;

(async function () {
	this.userLoggedIn = await getAuthToken() ? true : false;
})();

let deleteOnDeck = null;

const getTabs = () => new Promise(resolve => chrome.tabs.query({}, resolve));

function tabIsOpen(tabId, tabUrl) {
  let tabIsOpen = false;
  return new Promise(resolve => {
    getTabs().then(tabs => {
      tabs.map(tab => {
        if (tab.id === tabId && tab.url === tabUrl) {
          tabIsOpen = true;
        }
      });
      resolve(tabIsOpen);
    })
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (
    (deleteOnDeck && !tabIsOpen(deleteOnDeck.tabId, deleteOnDeck.url)) ||
    (deleteOnDeck && deleteOnDeck.tabId === tabId && !changeInfo.url)
  ) {
    // grab the noteId and set deleteOnDeck to null first because
    // otherwise we hit the api multiple times with a delete request
    const noteId = deleteOnDeck.noteId;
    deleteOnDeck = null;
    api.deleteNote(noteId);
  }
});

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
    if (deleteOnDeck) {
      api.deleteNote(deleteOnDeck.noteId);
    }

    deleteOnDeck = {
      noteId : request.noteId,
      tabId  : sender.tab.id,
      url    : sender.url
    };

    sendResponse(true);

    return true;
  } else if (request.type === 'updateNote') {
    api.updateNote(request.note.id, request.note).then(sendResponse);
    return true;
  } else if (request.type === 'undoDelete') {
    deleteOnDeck = null;
    sendResponse(true);
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
  } else if (request.type === 'login') {
    login(true).then(() => {
      this.userLoggedIn = true;
      sendResponse(true);
    });
  } else if (request.type === 'logout') {
    logout().then(() => {
      this.userLoggedIn = false;
      sendResponse(false);
    });
    return true;
  }
});
