const render = userProfile => {
  if (userProfile) {
    $('#rn_welcome').html(userProfile.email);
    $('#logged-out').fadeOut(() => $('#logged-in').fadeIn());
  } else {
    $('#logged-in').fadeOut(() => $('#logged-out').fadeIn());
  }
};

$(() => {
  chrome.runtime.sendMessage( { context: 'background', type: 'getState' },
    response =>  {
      render(response);
    }
  );

  $('#rn_log-in').on('click', e => {
    chrome.runtime.sendMessage({type: 'login'});
  });

  $('#rn_log-out').on('click', e => {
    chrome.runtime.sendMessage({type: 'logout'}, response => {
      render(false);
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  alert('received a message on the popup');
  alert(request);
  if (request.context === 'popup' && request.type === 'state') {
    render(
      request.state.userLoggedIn ?
      request.state.userProfile :
      false
    );
  }
});
