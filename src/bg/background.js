let state = {
  userLoggedIn: false,
  username: null,
};

const authWithRocketNote = async id_token => {
  console.log('Auth with RocketNote');
  console.log('ID_TOKEN:');
  console.log(id_token);

  chrome.storage.sync.get('id_token', function(tokenIsSet) {
    if (!tokenIsSet !== {} || !tokenIsSet) {
      chrome.storage.sync.set({ id_token }, function() {

      });
    }
  });
};

const apiRequest = (method, url, data, noHeader) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('id_token', function({ id_token }) {

      var config = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.getrocketnote.com/v1/auth",
        "method": "POST",
        "headers": {},
        "data": JSON.stringify(data)
      }

      // if (noHeader) {
      //   config.headers = {};
      // }

      // if (data) {
      //   config.data = data;
      // }

      console.log('config');
      console.log(config);

      $.ajax(config)
        .done(function(response) {
          resolve(response);
        })
        .fail(function(error) {
          reject(error)
        });
    });
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

    authWithRocketNote(id_token);


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
