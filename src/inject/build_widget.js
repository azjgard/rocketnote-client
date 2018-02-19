function buildWidget() {
	var relatedContent = $("#related");
	var widget = $(document.createElement("div"));
	var widgetAttr = {id: "rn_widget"};
	var noteContainer = buildNoteContainer();
	var noteInput = buildNoteInput();

	widget.attr(widgetAttr);
	widget.append(noteContainer);
	widget.append(noteInput);
	relatedContent.prepend(widget.hide().delay().fadeIn(300));
	noteContainer.scrollTop(noteContainer[0].scrollHeight);
}

function buildNoteContainer() {
	var noteContainer = $(document.createElement("div"));
	noteContainer.attr({id: "rn_note-container"});
	buildExistingNotes(noteContainer);
	return noteContainer;
}

function buildExistingNotes(container) {
	chrome.storage.sync.get({notes: {}}, function(result) {
		var existingNotes = result.notes[getCurrentVideoId()] || [];

		if (existingNotes.length > 0) {
			existingNotes.sort(function (a, b) {
				return a.timestamp - b.timestamp;
			});

			existingNotes.map(function (note) {
				var existingNote = $(document.createElement("div"));
				existingNote.attr({class: "existing-note"});
				var noteBody = buildNoteBody(note);
				existingNote.append(noteBody);

				container.append(existingNote);
			});
		} else {
			var noNotes = $(document.createElement("p")).addClass("rn_notes-placeholder").text("You have not yet added notes for this video.");
			container.append(noNotes);
		}

		return container;
	});

	function buildNoteBody(note) {
		var noteBody = $(document.createElement("p"));
		var videoUrl = "/watch?v=" + note.videoId + "&t=" + note.timestamp + "s";
		var pinIcon = $(document.createElement("img")).attr({
			src: chrome.runtime.getURL("assets/img/thumbtack_light.svg"),
			class: "pin-icon"
		});
		var timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl});

		if (note.content.length > 0) {
			noteBody.text(note.content);
			addClassToHashtags(noteBody);
		} else {
			noteBody.append(pinIcon);
			noteBody.addClass("pin");
		}

		if (note.timestamp >= 0) {
			var formattedTimestamp = formatTimestamp(note.timestamp);
			noteBody.prepend(timestamp.text(formattedTimestamp));
		}

		return noteBody;
	}
}

function buildNoteInput() {
	var inputForm = $(document.createElement("div")).attr({id: "rn_input-form"});
	var input = $(document.createElement("input")).attr({id: "rn_note-input", placeholder: "Type here..."});
	var pinIcon = $(document.createElement("img")).attr({
		src: chrome.runtime.getURL("assets/img/thumbtack_dark.svg"),
		class: "pin-icon"
	});
	var pinButton = $(document.createElement("button")).attr({
		class: "rn_button-action gray",
		id: "rn_pin"
	}).append(pinIcon);
	var submitButton = $(document.createElement("button")).attr({
		class: "rn_button-action",
		id: "rn_note-submit"
	}).text("Add");

	inputForm.append([input, pinButton, submitButton]);

	return inputForm;
}