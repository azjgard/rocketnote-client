const initWatchers = () => {
	watchClickAddNoteButton();
	watchClickPinButton();
	watchClickForCollapseNotes();
	watchKeyForInputFocus(73); 			// `i` for input focus
	watchKeyForPin(80); 						// `p` for pin
	watchKeyForCollapseNotes(79); 	// `o` for open (and close) widget
	watchKeyForInputBlur(27);				// `ESC` for input blur
	watchKeyForNoteSubmit(13); 			// `ENTER` for add note
	watchEnableEditActions(219);					// `[` for toggle edit actions
	watchTimestampForCurrentVideo();
	watchForPlaylist();
	watchForLiveVideo();
	watchMouseSelection();
	watchButtonForEditNote();
	watchForCancelEditNote();
	watchForEditNote();
	watchForDeleteNote();
	watchUndoAction();
	watchInputForFeedback();
	watchLogInButton();
	watchClickHelpButton();
};

const watchClickAddNoteButton = () => {
	$(document).on("click", "#rn_note-submit", () => {
		if (!loggedIn) {
			return;
		}
		addNoteIfInputHasContent();
	});
};

const watchClickPinButton = () => {
	$(document).on("click", "#rn_pin", () => {
		if (!loggedIn) {
			return;
		}
		addPin();
	});
};

const watchKeyForInputFocus = keyCode => {
	$(document).keyup(function (e) {
		if (e.keyCode === keyCode && !shortcutKeyShouldBePrevented(e)) {
			$("#rn_note-input").focus();
		}
	})
};

const watchKeyForInputBlur = keyCode => {
	$(document).keyup(function (e) {
		if (e.keyCode === keyCode) {
			$("#rn_note-input").blur();
		}
	})
};

const watchKeyForNoteSubmit = keyCode => {
	$(document).keyup(e => {
		if ($("#rn_note-input").is(":focus")) {
			if (e.keyCode === keyCode) {
				if (!loggedIn) {
					return;
				}
				addNoteIfInputHasContent();
			}
		}
	});
};

const watchKeyForPin = keyCode => {
	if (!loggedIn) {
		return;
	}
	$(document).keyup(e => {
		if (e.keyCode === keyCode && !shortcutKeyShouldBePrevented(e)) {
			if (!loggedIn) {
				return;
			}
			addPin();
		}
	});
};

const watchTimestampForCurrentVideo = () => {
	$(document).on("click", ".timestamp", e => {
		const currentVideoId = getCurrentVideoId();

		if (e.target.href.indexOf(currentVideoId) > -1) {
			const regex = /t=\d+/g;
			const time = event.target.href.match(regex);
			const video = $("video")[0];
			video.currentTime = time[0].substring(2);
			if (video.paused) {
				video.play();
			}
			e.preventDefault();
		}
	});
};

const watchLogInButton = () => {
	$(document).on("click", ".rn_notes-placeholder-login", () => {
		chrome.runtime.sendMessage({type: "login", context: "widget"}, () => {
			chrome.storage.onChanged.addListener(listenForAuth);
		});
	});

	function listenForAuth(changes) {
		const changedItems = Object.keys(changes);

		for (let item of changedItems) {
			if (item === "auth_token") {
				location.reload();
			}
		}
	}
};