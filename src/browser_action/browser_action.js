const render = name => {
  if (name) {
    $('#logged-in').find('h1').text('Hello, ' + name + '!');
    $('#logged-out').fadeOut(() => $('#logged-in').fadeIn());
  } else {
    $('#logged-in').fadeOut(() => $('#logged-out').fadeIn());
  }
};

$(document).ready(function($) {
  // It's important to understand that page actions don't retain
  // any kind of state after they've been closed. For that reason,
  // we need to manage all of the state in the background of the
  // chrome extension and get the state every time that the
  // page action is re-opened by the user.
  chrome.runtime.sendMessage({context: 'background', type: 'getState'});

  $('#logged-out > button').on('click', e => {
    chrome.runtime.sendMessage({type: 'login'});
  });

  $('#logged-in > button').on('click', e => {
    chrome.runtime.sendMessage({type: 'logout'});
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // We check the 'context' property first because we only
  // want to subscribe to messages that are specifically sent to
  // the popup.
  if (request.context === 'popup') {
    // This type of request will be called every time
    // that the popup is opened, so we can conditionally render
    // the HTML based on whether or not the user is logged in.
    if (request.type === 'state') {
      render(request.state.userLoggedIn ? request.state.username : false);
    } else {
      // The only other types of message will be 'login' or 'logout'
      render(request.type === 'login' ? request.data.name.givenName : false);
    }
  }
});
