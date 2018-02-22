$(() => {
	linkify.options.defaults.format = function(value) {
		return value.trunc(21);
	};

	addRecentNotesToDropdown();
	updateVersionNumber();
});

const addRecentNotesToDropdown = () => {
	let recentNotesContainer = $("#recent-notes");
	chrome.storage.sync.get("notes", function(results) {
		let recentNotes = results.notes.recent;
		recentNotes.slice().reverse().map(function(note) {
			recentNotesContainer.append(buildNoteBody(note));
		});
	});

	function buildNoteBody(note) {
		let noteBodyContainer = $(document.createElement("div")).addClass("recent-note");
		let noteContents = $(document.createElement("p")).addClass("recent-note-body");
		let noteBody = $(document.createElement("div")).addClass("note-body-container").append(noteContents);
		let videoUrl = "https://youtube.com/watch?v=" + note.videoId + "&t=" + note.timestamp + "s";
		let pinIcon = $(document.createElement("img")).attr({
			src: chrome.runtime.getURL("assets/img/thumbtack_dark.svg"),
			class: "pin-icon"
		});
		let timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl, target: "_blank"});
		let thumbnailUrl = getVideoThumbnailUrl(note.videoId);
		let thumbnail = $(document.createElement("img")).attr({src: thumbnailUrl, class: "rn_thumbnail"});

		noteBodyContainer.append(thumbnail);

		if (note.timestamp >= 0) {
			let formattedTimestamp = formatTimestamp(note.timestamp);
			noteBody.prepend(timestamp.text(formattedTimestamp));
		}

		if (note.content.length > 0) {
			noteContents.text(note.content.trunc(95));
			noteContents.linkify();
			addClassToHashtags(noteBody);
		} else {
			noteBody.append(pinIcon);
			noteBody.addClass("pin");
		}

		if (note.createdAt) {
			let dateCreated = $(document.createElement("span")).addClass("rn_date-created").text(moment(note.createdAt).fromNow());
			noteBodyContainer.append(dateCreated);
		}

		noteBodyContainer.append(noteBody);
		return noteBodyContainer;
	}
};

const getVideoThumbnailUrl = videoId => {
	return "https://i1.ytimg.com/vi/" + videoId +  "/mqdefault.jpg";
};

const updateVersionNumber = () => {
	let version = chrome.runtime.getManifest().version;
	$("#rn_version").text(version);
};