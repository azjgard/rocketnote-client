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
  if (request.type === 'getState') {
    chrome.runtime.sendMessage({
      context: 'popup',
      type: 'state',
      state,
    });
  }

  if (request.type === 'login') {
    const token = await login(true);
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
