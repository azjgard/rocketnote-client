let state = {
  userLoggedIn: false,
  username: null,
};

const login = interactive => {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({interactive: true}, token => resolve(token));
  });
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // This type of request will be sent by the browser action every time
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
    $.ajax({
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
