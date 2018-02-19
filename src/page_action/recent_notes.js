$(function() {
	addRecentNotesToDropdown();
});

function addRecentNotesToDropdown() {
	var recentNotesContainer = $("#recent-notes");
	chrome.storage.sync.get("notes", function(results) {
		var recentNotes = results.notes.recent;
		recentNotes.slice().reverse().map(function(note) {
			recentNotesContainer.append(buildNoteBody(note));
		});
	});

	function buildNoteBody(note) {
		var noteBody = $(document.createElement("p"));
		var videoUrl = "https://youtube.com/watch?v=" + note.videoId + "&t=" + note.timestamp + "s";
		var pinIcon = $(document.createElement("img")).attr({
			src: chrome.runtime.getURL("assets/img/thumbtack_dark.svg"),
			class: "pin-icon"
		});
		var timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl, target: "_blank"});

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

function getVideoThumbnail(videoId) {
	//TODO: Get video thumbnails for each video
	//TODO: Store thumbnail in chrome storage sync.
}