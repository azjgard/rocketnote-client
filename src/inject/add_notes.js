const addNote = isPin => {
	let video = $("video")[0];
	let input = $("#rn_note-input");
	let note = {};
	let tags = filterHashtags(content);

	note.content = isPin ? "" : input.val();
	note.videoId = getCurrentVideoId();
	note.formattedTags = tags.join(" ").toLowerCase();
	note.timestamp = Math.floor(video.currentTime);

	submitNote(note);

	function submitNote(note) {
		addNoteToContainer(note);
		storeNoteLocally(note);

		resetInput(isPin);
	}

	function resetInput(isPin) {
		if (!isPin) {
			input.val("");
			input.focus();
		}
		input.removeClass("error");
	}
};

const addNoteToContainer = ({content, timestamp, videoId}) => {
	let noteContainer = $("#rn_note-container");
	let notePlaceholder = $(".rn_notes-placeholder");
	let noteBody = $(document.createElement("p"));
	let timestampedUrl = "/watch?v=" + videoId + "&t=" + timestamp + "s";
	let timestampAnchor = $(document.createElement("a")).attr({
		class: "timestamp yt-simple-endpoint",
		href: timestampedUrl
	});
	let thumbtack = $(document.createElement("img")).attr({
		src: chrome.runtime.getURL("assets/img/thumbtack_light.svg"),
		class: "pin-icon"
	});

	if (content.length > 0) {
		noteBody.text(content);
		addClassToHashtags(noteBody);
	} else {
		noteBody.append(thumbtack);
		noteBody.addClass("pin");
	}

	if (timestamp >= 0) {
		const formattedTimestamp = formatTimestamp(timestamp);
		noteBody.prepend(timestampAnchor.text(formattedTimestamp));
	}
	noteContainer.append(noteBody);
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
	} else {
		addNote();
	}
};

const storeNoteLocally = note => {
	chrome.storage.sync.get({notes: {}}, function(result) {
		let notes = result.notes;
		notes.recent = notes.recent || [];
		notes.recent.push(note);
		if (notes.recent.length > 5) {
			notes.recent.shift();
		}
		notes[getCurrentVideoId()] = notes[getCurrentVideoId()] || [];
		notes[getCurrentVideoId()].push(note);

		chrome.storage.sync.set({notes: notes});
	});
};