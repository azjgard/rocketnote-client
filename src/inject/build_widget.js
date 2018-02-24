const buildWidget = () => {
	let relatedContent = $("#related");
	let widget = $(document.createElement("div"));
	let widgetAttr = {id: "rn_widget"};
	let noteContainer = buildNoteContainer();
	let noteInput = buildNoteInput();

	widget.attr(widgetAttr);
	widget.append(noteContainer);
	widget.append(noteInput);
	relatedContent.prepend(widget.hide().delay().fadeIn(300));
	noteContainer.scrollTop(noteContainer[0].scrollHeight);
};

const buildNoteContainer = () => {
	let noteContainer = $(document.createElement("div"));
	noteContainer.attr({id: "rn_note-container"});
	buildExistingNotes(noteContainer);
	return noteContainer;
};

const buildExistingNotes = container => {
	chrome.storage.sync.get({notes: {}}, function(result) {
		let existingNotes = result.notes[getCurrentVideoId()] || [];

		if (existingNotes.length > 0) {
			existingNotes.sort(function (a, b) {
				return a.createdAt - b.createdAt;
			});

			existingNotes.map(note => {
				let existingNote = $(document.createElement("div")).attr({class: "existing-note", id: "rn_note-" + note.id});
				let noteBody = buildNoteBody(note);
				let videoUrl = "/watch?v=" + note.videoId + "&t=" + note.timestamp + "s";
				let timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl});

				existingNote.append(noteBody);

				if (note.timestamp >= 0) {
					const formattedTimestamp = formatTimestamp(note.timestamp);
					existingNote.prepend(timestamp.text(formattedTimestamp));
				}

				addEditActions(existingNote);
				container.append(existingNote);
			});
		} else {
			const noNotes = $(document.createElement("p")).addClass("rn_notes-placeholder").text("You have not yet added notes for this video.");
			container.append(noNotes);
		}

		return container;
	});

	const buildNoteBody = note => {
		let noteBody = $(document.createElement("p"));
		let pinIcon = $(document.createElement("img")).attr({
			src: chrome.runtime.getURL("assets/img/thumbtack_light.svg"),
			class: "pin-icon"
		});

		if (note.content.length > 0) {
			noteBody.text(note.content);
			noteBody.linkify();
			addClassToHashtags(noteBody);
		} else {
			noteBody.append(pinIcon);
			noteBody.addClass("pin");
		}

		return noteBody;
	};
};

const buildNoteInput = () => {
	let inputForm = $(document.createElement("div")).attr({id: "rn_input-form"});
	let input = $(document.createElement("input")).attr({id: "rn_note-input", placeholder: "Type here..."});
	let pinIcon = $(document.createElement("img")).attr({
		src: chrome.runtime.getURL("assets/img/thumbtack_dark.svg"),
		class: "pin-icon"
	});
	let pinButton = $(document.createElement("button")).attr({
		class: "rn_button-action gray",
		id: "rn_pin"
	}).append(pinIcon);
	let submitButton = $(document.createElement("button")).attr({
		class: "rn_button-action",
		id: "rn_note-submit"
	}).text("Add");

	inputForm.append([input, pinButton, submitButton]);

	return inputForm;
};