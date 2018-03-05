const buildWidget = () => {
	let relatedContent = $("#related");
	let widget = $(document.createElement("div"));
	let widgetAttr = {id: "rn_widget"};
	let noteContainer = buildNoteContainer();
	let noteInput = buildNoteInput();
	let settingsButton = $(document.createElement("button")).attr({id: "rn_enable-edit", class: "rn_button-action"});
	let settingsIcon = $(document.createElement("img")).attr({
		class: "settings-icon",
		src: chrome.runtime.getURL("assets/img/settings_gray.svg")
	});
	let dashboardLink = $(document.createElement("a")).attr({href: "https://getrocketnote.com/notes", target: "_blank", class: "rn_dashboard-link"}).text("view all");

	settingsButton.append(settingsIcon);
	widget.attr(widgetAttr);
	widget.append([settingsButton, noteContainer, noteInput, dashboardLink]);
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
	if (loggedIn) {
		chrome.runtime.sendMessage({type: "getNotesByVideo", currentVideoId: getCurrentVideoId()}, notes => {
			let existingNotes = notes || [];

			if (existingNotes.length > 0) {
				existingNotes.sort(function (a, b) {
					return moment(a.createdAt).unix() - moment(b.createdAt).unix();
				});

				existingNotes.map(note => {
					let existingNote = $(document.createElement("div")).attr({class: "existing-note", id: "rn_note-" + note.id, originalContent: note.content});
					let noteBody = buildNoteBody(note);
					let videoUrl = "/watch?v=" + note.videoId + "&t=" + note.timestamp + "s";
					let timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl, duration: note.timestamp, originalDuration: note.timestamp});

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
	} else {
		let notLoggedInMessage = $(document.createElement("p")).addClass("rn_notes-placeholder")
			.text(" to take notes.");
		let logInButton = $(document.createElement("a")).addClass("rn_notes-placeholder-login").text("Log in");

		notLoggedInMessage.prepend(logInButton);
		container.append(notLoggedInMessage);
	}
};

const buildNoteInput = () => {
	let inputForm = $(document.createElement("div")).attr({id: "rn_input-form"});
	let inputLimit = $(document.createElement("span")).text("255").attr({id: "rn_input-limit"});
	let input = $(document.createElement("input")).attr({id: "rn_note-input", placeholder: "Type here...", maxlength: 300});
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

	inputForm.append([input, inputLimit, pinButton, submitButton]);

	return inputForm;
};

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

function buildTimestampNotification() {
	$(".timestamp-notification").remove();

	const playerContainer = $("#player-container");
	const timestampNotification = $(document.createElement("div")).addClass("timestamp-notification");
	const notification = $(document.createElement("p"))
		.text("Your note is in editing mode. Change this note's timestamp by adjusting the current time the video is at (red timeline below).");
	timestampNotification.append(notification).appendTo(playerContainer);
}