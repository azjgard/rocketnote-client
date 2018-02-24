let state = {
  userLoggedIn: false,
  username: null,
};

const setAuthToken = auth_token => new Promise(resolve =>
  chrome.storage.sync.set({ auth_token }, resolve)
);

const getAuthToken = () => new Promise(resolve =>
  chrome.storage.sync.get('auth_token', result => resolve(result.auth_token))
);

const clearAuthToken = () => new Promise(resolve =>
  chrome.storage.sync.set({ auth_token: null }, resolve)
);

const isLoggedIn = async () => await getAuthToken() ? true : false;

const apiRequest = (method, relativePath, data, noHeader) =>  {
  return new Promise(async (resolve, reject) => {
    const baseUrl = 'https://api.getrocketnote.com/v1';
    const url     = `${baseUrl}${relativePath}`;

    const config = {
      url,
      method,
      headers: {},
      contentType : "application/json"
    }

    if (await isLoggedIn()) {
      config.headers.Authorization = await getAuthToken();
    }

    if (method.match(/post/)) {
      config.data = JSON.stringify(data);
    }

    $.ajax(config).done(resolve).fail(reject);
  });
};

const login = interactive => {
  return new Promise((resolve, reject) => {

    const manifest     = chrome.runtime.getManifest();
    const scopes       = encodeURIComponent(manifest.oauth2.scopes.join(' '));
    const clientId     = encodeURIComponent(manifest.oauth2.client_id);
    const redirectUri  = encodeURIComponent('urn:ietf:wg:oauth:2.0:oob:auto');
    const responseType = encodeURIComponent('id_token');

    const url = 'https://accounts.google.com/o/oauth2/auth' + 
      '?client_id=' + clientId + 
      '&response_type=' + responseType +
      '&access_type=offline' + 
      '&redirect_uri=' + redirectUri + 
      '&prompt=consent' +
      '&scope=' + scopes;


    const RESULT_PREFIX = ['Success', 'Denied', 'Error'];

    chrome.tabs.create({'url': 'about:blank'}, function(authenticationTab) {
      chrome.tabs.onUpdated.addListener(async function googleAuthorizationHook(tabId, changeInfo, tab) {
        if (tabId === authenticationTab.id) {

          const titleParts = tab.title.split(' ', 2);
          const result     = titleParts[0];

          if (titleParts.length == 2 && RESULT_PREFIX.indexOf(result) >= 0) {
            chrome.tabs.onUpdated.removeListener(googleAuthorizationHook);
            chrome.tabs.remove(tabId);

            const response = titleParts[1];

            if (response.includes('id_token=')) {
              const id_token = response.split('&')[0].replace('id_token=', '');
              resolve(id_token);
            }
            else {
              console.log('There was an error.');
            }
          }
        }
      });
      chrome.tabs.update(authenticationTab.id, {'url': url});
    });
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
    const id_token = await login(true);

    await setAuthToken(id_token);


    // $.ajax({
    //     url: 'https://www.googleapis.com/plus/v1/people/me',
    //     headers: {Authorization: 'Bearer ' + token},
    //   })
    //   .done(response => {
    //     state = {
    //       userLoggedIn: true,
    //       username: response.name.givenName,
    //     };

    //     chrome.runtime.sendMessage({
    //       context: 'popup',
    //       type: 'login',
    //       data: response,
    //     });
    //   });
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
