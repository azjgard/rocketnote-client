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
};

const watchClickAddNoteButton = () => {
	$(document).on("click", "#rn_note-submit", () => {
		addNoteIfInputHasContent();
	});
};

const watchClickPinButton = () => {
	$(document).on("click", "#rn_pin", () => {
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
				addNoteIfInputHasContent();
			}
		}
	});
};

const watchKeyForPin = keyCode => {
	$(document).keyup(e => {
		if (e.keyCode === keyCode && !shortcutKeyShouldBePrevented(e)) {
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