const addNote = (isPin, content) => {
	let video = $("video")[0];
	let input = $("#rn_note-input");
	let note = {};

	note.content = isPin ? "" : input.val();
	note.content = content ? content : note.content;
	let unformattedTags = filterHashtags(note.content);
	note.videoId = getCurrentVideoId();
	note.tags = unformattedTags.join(" ");
	note.timestamp = isPin ? Math.floor(video.currentTime) : Math.floor(currentTimestamp);
	note.createdAt = moment().format();

	submitNote(note);

	if ($("#rn_note-submit").hasClass("feedback")) {
		let feedback = {
			content: note.content,
		};
		submitFeedback(feedback);
	}

	function submitNote(note) {
		storeNote(note);
		resetInput(isPin);
	}

	function resetInput(isPin) {
		if (!isPin) {
			input.val("");
			input.focus();
		}
		input.removeClass("error");
		currentTimestamp = null;
	}
};

const storeNote = note => {
	return chrome.runtime.sendMessage({type: "storeNote", note: note}, response => {
		addNoteToContainer(response.note);
		storeNoteLocally(response.note);
	});
};

const addNoteToContainer = ({content, timestamp, videoId, id}) => {
	let noteContainer = $("#rn_note-container");
	let notePlaceholder = $(".rn_notes-placeholder");
	let noteBodyContainer  = $(document.createElement("div")).attr({class: "existing-note", id: "rn_note-" + id, originalContent: content});
	let noteBody = $(document.createElement("p"));
	let timestampedUrl = "/watch?v=" + videoId + "&t=" + timestamp + "s";
	let timestampAnchor = $(document.createElement("a")).attr({
		class: "timestamp yt-simple-endpoint",
		href: timestampedUrl,
		duration: timestamp,
		originalDuration: timestamp
	});
	let thumbtack = $(document.createElement("img")).attr({
		src: chrome.runtime.getURL("assets/img/thumbtack_light.svg"),
		class: "pin-icon"
	});

	if (content.length > 0) {
		noteBody.text(content);
		noteBody.linkify();
		addClassToHashtags(noteBody);
	} else {
		noteBody.append(thumbtack);
		noteBody.addClass("pin");
	}

	if (timestamp >= 0) {
		const formattedTimestamp = formatTimestamp(timestamp);
		noteBodyContainer.prepend(timestampAnchor.text(formattedTimestamp));
	}

	addEditActions(noteBodyContainer);
	noteBodyContainer.append(noteBody);
	noteContainer.append(noteBodyContainer);
	noteContainer.scrollTop(noteContainer[0].scrollHeight);

	if (notePlaceholder.length) {
		notePlaceholder.remove();
	}
};

const addPin = () => {
	const isPin = true;
	addNote(isPin);
};

const addNoteIfInputHasContent = () => {
	let input = $("#rn_note-input");
	if (input.val() === "") {
		input.addClass("error");
		input.focus();
	} else if (!$("#rn_note-submit").hasClass("disabled")) {
		addNote();
	}
};

const storeNoteLocally = note => {
	chrome.storage.local.get({notes: {}}, result => {
		let notes = result.notes;
		notes.recent = notes.recent || [];
		notes.recent.push(note);
		if (notes.recent.length > 5) {
			notes.recent.shift();
		}
		notes[getCurrentVideoId()] = notes[getCurrentVideoId()] || [];
		notes[getCurrentVideoId()].push(note);

		chrome.storage.local.set({notes});
	});
};

const submitFeedback = feedback => {
	chrome.runtime.sendMessage({type: "sendFeedback", feedback: feedback});
	changeToAddNote();
};

const watchInputForFeedback = () => {
	$(document).on("keyup", "#rn_note-input", () => {
		let inputValue = $("#rn_note-input").val();
		if (inputValue.indexOf("#feedback") > -1) {
			changeToSubmitFeedback();
		} else {
			changeToAddNote();
		}
	});
};

function changeToSubmitFeedback() {
	$("#rn_note-submit").addClass("feedback").text("Submit Feedback");
}

function changeToAddNote() {
	$("#rn_note-submit").removeClass("feedback").text("Add");
}