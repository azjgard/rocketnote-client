chrome.runtime.sendMessage({
  type: 'showPageAction'
}, function () {
	let readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			let currentVideoId = getCurrentVideoId();
			clearInterval(readyStateCheckInterval);
			buildWidget();
			watchAddNoteButton();
			watchPinButton();
			watchKeyForInputFocus(78); 	// `n` for input focus
			watchKeyForNoteSubmit(13); 	// `ENTER` for add note
			watchKeyForPin(80); 				// `p` for pin
			watchTimestampForCurrentVideo();
			watchForPlaylist();
			watchVideoForChanges(currentVideoId);

			function watchVideoForChanges() {
				setInterval(function() {
					if (currentVideoId !== getCurrentVideoId()) {
						refreshWidget();
						currentVideoId = getCurrentVideoId();
					}
				}, 500);
			}
		}
	}, 500);
});

function refreshWidget() {
	let container = $("#rn_note-container");
	container.empty();
	buildExistingNotes(container);
}