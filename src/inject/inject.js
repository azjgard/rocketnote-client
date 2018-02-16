chrome.runtime.sendMessage({}, function () {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			buildWidget();
			watchAddNoteButton();
			watchKeyForInputFocus(78);
			watchKeyForNoteSubmit(13);
		}
	}, 300);
});

function buildWidget() {
	var relatedContent = $("#related");
	var widget = $(document.createElement("div"));
	var widgetAttr = getWidgetAttributes();
	var noteContainer = buildNoteContainer();
	var noteInput = buildNoteInput();

	widget.attr(widgetAttr);
	widget.append(noteContainer);
	widget.append(noteInput);
	relatedContent.prepend(widget);
	noteContainer.scrollTop(noteContainer[0].scrollHeight);
}

function watchAddNoteButton() {
	$(document).on("click", "#rn_note-submit", function() {
		addNote();
	});
}

function getWidgetAttributes() {
	return {
		id: "rn_widget"
	};
}

function buildNoteContainer() {
	var noteContainer = $(document.createElement("div"));
	noteContainer.attr({id: "rn_note-container"});
	buildExistingNotes(noteContainer);
	return noteContainer;
}

function getExistingNotes() {
	//TODO: Pull existing notes in from localstorage or wherever (background.js?).
	return {
		data: [
			{
				timestamp: 59,
				content: "This is the #coolest thing ever.",
				tags: "lit dope",
				video: {
					id: "M6bUNRCghfE",
					title: "How to be a more confident designer."
				}
			},
			{
				timestamp: 71,
				content: "#dope I need to #remember this.",
				tags: "supercool dope",
				video: {
					id: "M6bUNRCghfE",
					title: "How to be a more confident designer."
				}
			},
			{
				timestamp: 123,
				content: "",
				tags: "",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 59,
				content: "This is #the coolest thing ever.",
				tags: "lit dope",
				video: {
					id: "M6bUNRCghfE",
					title: "How to be a more confident designer."
				}
			},
			{
				timestamp: 71,
				content: "I need to remember #this.",
				tags: "supercool dope",
				video: {
					id: "M6bUNRCghfE",
					title: "How to be a more confident designer."
				}
			},
			{
				timestamp: 180,
				content: "This one is #especially long, because I want to test its #ability to work with really long #notes. I'm hoping I can make this work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 180,
				content: "This one is #especially long, because I want to test its ability to work with really long notes. I'm #hoping I can make this work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 100,
				content: "#100 This one is especially long, because #I want to test its ability to #work with really #long notes. I'm hoping I can make this #work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 180,
				content: "This one is especially long, because I want to test its ability to work with really long notes. I'm hoping I can make this work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 180,
				content: "This one is especially long, because I want to test its ability to work with really long notes. I'm hoping I can make this work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 180,
				content: "This one is especially long, because I want to test its ability to work with really long notes. I'm hoping I can make this work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 180,
				content: "This one is especially long, because I want to test its ability to work with really long notes. I'm hoping I can make this work really well and #not #look #super #dumb",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 180,
				content: "This one is especially long, #because I want to test its ability to work with really long notes. I'm hoping I can make this work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 180,
				content: "This one is especially long, because I want to test its ability to work with really long notes. I'm hoping I can make this work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			},
			{
				timestamp: 0,
				content: "#FIRST! This one is especially long, because I want to test its ability to work with really long notes. I'm hoping I can make this work really well and not look super dumb.",
				tags: "don't stop believing or we might all die on our own",
				video: {
					id: "oemgPLZKVFI",
					title: "Jack Coyne's ONE tip for YouTubers...wait til the end"
				}
			}
		]
	};
}

function buildExistingNotes(container) {
	existingNotes = getExistingNotes().data.sort(function(a, b) {
		return a.timestamp - b.timestamp;
	});

	existingNotes.map(function(note) {
		var existingNote = $(document.createElement("div"));
		existingNote.attr({class: "existing-note"});
		var noteBody = buildNoteBody(note, existingNote);
		existingNote.append(noteBody);

		container.append(existingNote);
	});

	return container;

	function buildNoteBody(note, existingNote) {
		var noteBody = $(document.createElement("p"));
		var videoUrl = "/watch?v=" + note.video.id + "&t=" + note.timestamp + "s";
		var timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl});

		if (note.content.length > 0) {
			noteBody.text(note.content);
			addClassToHashtags(noteBody);
		} else {
			noteBody.text("pinned");
			existingNote.addClass("pin");
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
	var submitButton = $(document.createElement("button")).attr({class: "rn_button-action", id: "rn_note-submit"}).text("Add");

	inputForm.append([input, submitButton]);

	return inputForm;
}

function addNote() {
	var video = $("video")[0];
	var input = $("#rn_note-input");
	var content = input.val();
	var timestamp = Math.floor(video.currentTime);
	var videoId = getParameterByName("v");
	var tags = filterHashtags(content);
	var formattedTags = tags.join(" ");

	submitNote(content, timestamp, videoId, formattedTags);

	function submitNote(content, timestamp, videoId, tags) {
		addNoteToContainer(content, timestamp, videoId);
		input.val("");
		input.focus();
	}

	function addNoteToContainer(content, timestamp, videoId) {
		var noteContainer = $("#rn_note-container");
		var noteBody = $(document.createElement("p"));
		var timestampedUrl = "/watch?v=" + videoId + "&t=" + timestamp + "s";
		var timestampAnchor = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: timestampedUrl});

		if (content.length > 0) {
			noteBody.text(content);
			addClassToHashtags(noteBody);
		} else {
			noteBody.text("pinned");
			noteContainer.addClass("pin");
		}

		if (timestamp >= 0) {
			var formattedTimestamp = formatTimestamp(timestamp);
			noteBody.prepend(timestampAnchor.text(formattedTimestamp));
		}
		noteContainer.append(noteBody);
		noteContainer.scrollTop(noteContainer[0].scrollHeight);
	}
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function filterHashtags(string) {
	var re = /(?:^|\W)#(\w+)(?!\w)/g, match, tags = [];
	while (match = re.exec(string)) {
		tags.push(match[1]);
	}

	return tags;
}

function addClassToHashtags(note) {
	note.html(function(_, html) {
		return html.replace(/(\#\w+)/g, '<span class="rn_tag">$1</span>');
	});
}

function formatTimestamp(timestamp) {
	return String(moment.utc(timestamp*1000).format('mm:ss'));
}

function watchKeyForInputFocus(charCode) {
	$(document).keyup(function(e) {
		if (e.keyCode === charCode) {
			$("#rn_note-input").focus();
		}
	})
}

function watchKeyForNoteSubmit(charCode) {
	$(document).keyup(function(e) {
		if ($("#rn_note-input").is(":focus")) {
			if (e.keyCode === charCode) {
				addNote();
			}
		}
	});
}