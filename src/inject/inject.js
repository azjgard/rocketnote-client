chrome.runtime.sendMessage({
	type: 'showPageAction'
}, () => {
	let readyStateCheckInterval = setInterval(() => {
		if (document.readyState === "complete") {
			if ($("#related").length) {
				initRocketNote();
			}

			function initRocketNote() {
				let currentVideoId = getCurrentVideoId();
				clearInterval(readyStateCheckInterval);
				buildWidget();
				addRocketLogoToPlayerControls();
				watchClickAddNoteButton();
				watchClickPinButton();
				watchClickForCollapseNotes();
				watchKeyForInputFocus(73); 			// `i` for input focus
				watchKeyForPin(80); 						// `p` for pin
				watchKeyForCollapseNotes(79); 	// `o` for open (and close) widget
				watchKeyForInputBlur(27);				// `ESC` for input blur
				watchKeyForNoteSubmit(13); 			// `ENTER` for add note
				watchTimestampForCurrentVideo();
				watchForPlaylist();
				watchForLiveVideo();
				watchMouseSelection();
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
		}
	}, 1000);
});

const refreshWidget = () => {
	let container = $("#rn_note-container");
	container.empty();
	buildExistingNotes(container);
};