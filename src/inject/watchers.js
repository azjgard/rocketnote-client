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
		if ($(e.target).closest("input")[0]) {
			return;
		}
		if (e.keyCode === keyCode) {
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
		if ($(e.target).closest("input")[0]) {
			return;
		}
		if (e.keyCode === keyCode) {
			addPin();
		}
	});
};

const watchTimestampForCurrentVideo = () => {
	const currentVideoId = getCurrentVideoId();

	$(document).on("click", ".timestamp[href*=" + currentVideoId + "]", e => {
		const regex = /t=\d+/g;
		const time = event.target.href.match(regex);
		$("video")[0].currentTime = time[0].substring(2);
		e.preventDefault();
	});
};