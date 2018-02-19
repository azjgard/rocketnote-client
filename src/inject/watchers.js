const watchAddNoteButton = () => {
	$(document).on("click", "#rn_note-submit", () => {
		addNoteIfInputHasContent();
	});
};

const watchPinButton = () => {
	$(document).on("click", "#rn_pin", () => {
		addPin();
	});
};

const watchKeyForInputFocus = charCode => {
	$(document).keyup(function (e) {
		if ($(e.target).closest("input")[0]) {
			return;
		}
		if (e.keyCode === charCode) {
			$("#rn_note-input").focus();
		}
	})
};

const watchKeyForNoteSubmit = charCode => {
	$(document).keyup(e => {
		if ($("#rn_note-input").is(":focus")) {
			if (e.keyCode === charCode) {
				addNoteIfInputHasContent();
			}
		}
	});
};

const watchKeyForPin = charCode => {
	$(document).keyup(e => {
		if ($(e.target).closest("input")[0]) {
			return;
		}
		if (e.keyCode === charCode) {
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