function watchAddNoteButton() {
	$(document).on("click", "#rn_note-submit", function () {
		addNoteIfInputHasContent();
	});
}

function watchPinButton() {
	$(document).on("click", "#rn_pin", function () {
		addPin();
	});
}

function watchKeyForInputFocus(charCode) {
	$(document).keyup(function (e) {
		if ($(e.target).closest("input")[0]) {
			return;
		}
		if (e.keyCode === charCode) {
			$("#rn_note-input").focus();
		}
	})
}

function watchKeyForNoteSubmit(charCode) {
	$(document).keyup(function (e) {
		if ($("#rn_note-input").is(":focus")) {
			if (e.keyCode === charCode) {
				addNoteIfInputHasContent();
			}
		}
	});
}

function watchKeyForPin(charCode) {
	$(document).keyup(function (e) {
		if ($(e.target).closest("input")[0]) {
			return;
		}
		if (e.keyCode === charCode) {
			addPin();
		}
	});
}

function watchTimestampForCurrentVideo() {
	const currentVideoId = getCurrentVideoId();

	$(document).on("click", ".timestamp[href*=" + currentVideoId + "]", function (event) {
		const regex = /t=\d+/g;
		const time = event.target.href.match(regex);
		$("video")[0].currentTime = time[0].substring(2);
		event.preventDefault();
	});
}