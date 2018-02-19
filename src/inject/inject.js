chrome.runtime.sendMessage({}, function () {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			var currentVideoId = getCurrentVideoId();
			clearInterval(readyStateCheckInterval);
			buildWidget();
			getNotes();
			watchAddNoteButton();
			watchPinButton();
			watchKeyForInputFocus(78);
			watchKeyForNoteSubmit(13);
			watchKeyForPin(80);
			watchTimestampForCurrentVideo();
			watchForPlaylist();
			watchVideoForChanges(currentVideoId);

			function watchVideoForChanges() {
				setInterval(function() {
					if (currentVideoId !== getCurrentVideoId()) {
						refreshWidget();
						currentVideoId = getCurrentVideoId();
					}
				}, 500);
			}
		}
	}, 500);
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
	$(document).on("click", "#rn_note-submit", function () {
		addNoteIfInputHasContent();
	});
}

function watchPinButton() {
	$(document).on("click", "#rn_pin", function () {
		addPin();
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

function buildExistingNotes(container) {
	chrome.storage.sync.get({notes: {}}, function(result) {
		var existingNotes = result.notes[getCurrentVideoId()] ? result.notes[getCurrentVideoId()] : [];

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

function addNote(isPin) {
	var video = $("video")[0];
	var input = $("#rn_note-input");
	var content = isPin ? "" : input.val();
	var timestamp = Math.floor(video.currentTime);
	var videoId = getCurrentVideoId();
	var tags = filterHashtags(content);
	var formattedTags = tags.join(" ");

	submitNote(content, timestamp, videoId, formattedTags);

	function submitNote(content, timestamp, videoId, tags) {
		var note = {
			content: content,
			timestamp: timestamp,
			videoId: videoId,
			tags: tags
		};
		addNoteToContainer(content, timestamp, videoId);
		storeNoteLocally(note);
		if (!isPin) {
			input.val("");
			input.focus();
		}
		input.removeClass("error");
	}
}

function addNoteToContainer(content, timestamp, videoId) {
	var noteContainer = $("#rn_note-container");
	var noteBody = $(document.createElement("p"));
	var timestampedUrl = "/watch?v=" + videoId + "&t=" + timestamp + "s";
	var timestampAnchor = $(document.createElement("a")).attr({
		class: "timestamp yt-simple-endpoint",
		href: timestampedUrl
	});
	var thumbtack = $(document.createElement("img")).attr({
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
		var formattedTimestamp = formatTimestamp(timestamp);
		noteBody.prepend(timestampAnchor.text(formattedTimestamp));
	}
	noteContainer.append(noteBody);
	noteContainer.scrollTop(noteContainer[0].scrollHeight);
}

function addPin() {
	var isPin = true;
	addNote(isPin);
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
	note.html(function (_, html) {
		return html.replace(/(\#\w+)/g, '<span class="rn_tag">$1</span>');
	});
}

function formatTimestamp(timestamp) {
	return String(moment.utc(timestamp * 1000).format('mm:ss'));
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

function addNoteIfInputHasContent() {
	var input = $("#rn_note-input");
	if (input.val() === "") {
		input.addClass("error");
		input.focus();
	} else {
		addNote();
	}
}

function getNotes() {
	var allNotes = requests.getNotes();
}

function watchTimestampForCurrentVideo() {
	var currentVideoId = getCurrentVideoId();

	$(document).on("click", ".timestamp[href*=" + currentVideoId + "]", function (event) {
		var regex = /t=\d+/g;
		var time = event.target.href.match(regex);
		$("video")[0].currentTime = time[0].substring(2);
		event.preventDefault();
	});
}

function storeNoteLocally(note) {
	chrome.storage.sync.get({notes: {}}, function(result) {
		var notes = result.notes;
		notes[getCurrentVideoId()] = notes[getCurrentVideoId()] ? notes[getCurrentVideoId()] : [];
		notes[getCurrentVideoId()].push(note);

		chrome.storage.sync.set({notes: notes}, function() {
			console.log("New note has been added.");
		});
	});
}

function getCurrentVideoId() {
	return getParameterByName("v");
}

function refreshWidget() {
	var container = $("#rn_note-container");
	container.empty();
	buildExistingNotes(container);
	console.log("Widget Refreshed.");
}