const getIdToken = interactive => {
  return new Promise((resolve, reject) => {

    const manifest     = chrome.runtime.getManifest();
    const scopes       = encodeURIComponent(manifest.oauth2.scopes.join(' '));
    const clientId     = encodeURIComponent(manifest.oauth2.client_id);
    const redirectUri  = encodeURIComponent('urn:ietf:wg:oauth:2.0:oob:auto');
    const responseType = encodeURIComponent('id_token');

    const url = 'https://accounts.google.com/o/oauth2/auth' +
      '?client_id='                                         + clientId     +
      '&response_type='                                     + responseType +
      '&access_type=offline'                                +
      '&redirect_uri='                                      + redirectUri  +
      '&prompt=consent'                                     +
      '&scope='                                             + scopes;

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
              console.log(id_token);
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

const tradeIdTokenForAuthToken = id_token => new Promise((resolve, reject) => {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": baseUrl + "/auth",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    "processData": false,
    "data": JSON.stringify({ id_token })
  };

  $.ajax(settings).done(resolve);
});

const storeAuthToken = auth_token => new Promise(resolve =>
  chrome.storage.sync.set({ auth_token }, resolve)
);

const getAuthToken = () => new Promise(resolve =>
  chrome.storage.sync.get('auth_token', token => resolve(token.auth_token))
);

const clearAuthToken = () => new Promise(resolve =>
  chrome.storage.sync.set({ auth_token: null }, resolve)
);

const login = interactive => new Promise((resolve, reject) =>
  getIdToken(interactive) // defined in idToken.js
  .then(tradeIdTokenForAuthToken)
  .then(storeAuthToken)
  .then(resolve)
);

const logout = () => clearAuthToken();
