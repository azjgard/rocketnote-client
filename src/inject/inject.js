chrome.runtime.sendMessage({
  type: 'showPageAction'
}, () => {
	let readyStateCheckInterval = setInterval(() => {
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

			function watchVideoForChanges(currentVideoId) {
				setInterval(() => {
					if (currentVideoId !== getCurrentVideoId()) {
						refreshWidget();
						currentVideoId = getCurrentVideoId();
					}
				}, 1000);
			}
		}
	}, 500);
});

const refreshWidget = () => {
	let container = $("#rn_note-container");
	container.empty();
	buildExistingNotes(container);
};