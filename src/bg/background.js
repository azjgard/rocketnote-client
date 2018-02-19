var state = {
  userLoggedIn: false,
  username: null,
};

const pageActionWhitelist = ['youtube.com'];

const shouldShowPageAction = currentUrl =>
  pageActionWhitelist.findIndex(url => currentUrl.includes(url)) !== -1;

const login = interactive => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({interactive: true}, token => resolve(token));
  });
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === 'showPageAction') {
    // NOTE: We are checking for sender.tab because
    // if the message is being sent from a popup then it
    // will be undefined and we don't want to worry
    // about showing a page action.
    const showPageAction = sender.tab && shouldShowPageAction(sender.tab.url);

    if (showPageAction) {
      chrome.pageAction.show(sender.tab.id);
    }
  }

  // This type of request will be sent by the page action every time
  // that the popup is opened. It conditionally renders the HTML
  // based on the current state of the extension (whether or not
  // the user is logged in)
  if (request.type === 'getState') {
    chrome.runtime.sendMessage({
      context: 'popup',
      type: 'state',
      state,
    });
  }

  if (request.type === 'login') {
    const token = await login(true);

    // This ajax request isn't necessary to actually log the user
    // in, but it's here so that we can grab their information and
    // use it in the "Hello, {user}!" message inside of the popup. We
    // also need to get their account id to authenticate requests to the API.
    jQuery
      .ajax({
        url: 'https://www.googleapis.com/plus/v1/people/me',
        headers: {Authorization: 'Bearer ' + token},
      })
      .done(response => {
        state = {
          userLoggedIn: true,
          username: response.name.givenName,
        };

        chrome.runtime.sendMessage({
          context: 'popup',
          type: 'login',
          data: response,
        });
      });
  } else if (request.type === 'logout') {
    chrome.identity.getAuthToken({}, token => {
      chrome.identity.removeCachedAuthToken({token}, () => {
        state = {
          userLoggedIn: false,
          username: null,
        };
        chrome.runtime.sendMessage({
          context: 'popup',
          type: 'logout',
        });
      });
    });
  }
});
