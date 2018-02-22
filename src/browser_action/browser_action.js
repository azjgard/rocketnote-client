const render = name => {
  if (name) {
    $('#rn_welcome').html("Not <b>" + name + "</b>?");
    $('#logged-out').fadeOut(() => $('#logged-in').fadeIn());
  } else {
    $('#logged-in').fadeOut(() => $('#logged-out').fadeIn());
  }
};

$(document).ready($ => {
  chrome.runtime.sendMessage({context: 'background', type: 'getState'});

  $('#rn_log-in').on('click', e => {
    chrome.runtime.sendMessage({type: 'login'});
  });

  $('#rn_log-out').on('click', e => {
    chrome.runtime.sendMessage({type: 'logout'});
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.context === 'popup') {
    if (request.type === 'state') {
      render(request.state.userLoggedIn ? request.state.username : false);
    } else {
      render(request.type === 'login' ? request.data.name.givenName : false);
    }
  }
});
