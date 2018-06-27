const addNote = (isPin, content) => {
	let video = $("video")[0];
	let input = $("#rn_note-input");
	let note = {};

	note.content = isPin ? "" : input.text();
	note.content = content ? content : note.content;
	let unformattedTags = filterHashtags(note.content);
	note.videoId = getCurrentVideoId();
	note.tags = unformattedTags.join(" ");
	note.timestamp = isPin ? Math.floor(video.currentTime) : Math.floor(currentTimestamp);
	note.createdAt = moment().format();
	note.meta = {};
	note.meta.videoTitle = $(".title").find(".ytd-video-primary-info-renderer").text();
	note.meta.channelName = $(".iv-branding-context-name").text();
	note.meta.channelUrl = "https://youtube.com" + $("a.ytd-video-owner-renderer").attr("href");
	note.meta.videoCategory = $(".description").find("#collapsible a").text() || "undefined";
	note.meta.userChannel = $(".ytp-watch-later-button").attr("title").replace("Watch later as ", "") || "undefined";

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
			input.text("");
			input.focus();
		}
		input.removeClass("error");
		currentTimestamp = null;
		$("#rn_input-limit").text("255");
	}
};

const storeNote = note => {
	return chrome.runtime.sendMessage({type: "storeNote", note: note}, response => {
		addNoteToContainer(response.note);
		if (response.note) {
            updateNotesRemaining();
        }
    });

    function updateNotesRemaining() {
        let limitTextNode = $("#notes-remaining");

        if (limitTextNode) {
            let notesRemaining = limitTextNode.text();
            notesRemaining--;
            limitTextNode.text(notesRemaining);
        }
    }
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
	if (input.text() === "") {
		input.addClass("error");
		input.focus();
	} else if (!$("#rn_note-submit").hasClass("disabled")) {
		addNote();
	}
};

const submitFeedback = feedback => {
	chrome.runtime.sendMessage({type: "sendFeedback", feedback: feedback});
	changeToAddNote();
};

const watchInputForFeedback = () => {
	$("body").on("keyup keydown paste", () => {
		let input = $("#rn_note-input");

		if (input.is(":focus")) {
			let inputValue = input.text();
			if (inputValue.indexOf("#feedback") > -1) {
				changeToSubmitFeedback();
			} else {
				changeToAddNote();
			}
		}
	});
};

function changeToSubmitFeedback() {
	$("#rn_note-submit").addClass("feedback").text("Submit Feedback");
}

function changeToAddNote() {
	$("#rn_note-submit").removeClass("feedback").text("Add");
}