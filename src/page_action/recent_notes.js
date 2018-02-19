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
		var noteBodyContainer = $(document.createElement("div")).addClass("recent-note");
		var noteBody = $(document.createElement("p")).addClass("recent-note-body");
		var videoUrl = "https://youtube.com/watch?v=" + note.videoId + "&t=" + note.timestamp + "s";
		var pinIcon = $(document.createElement("img")).attr({
			src: chrome.runtime.getURL("assets/img/thumbtack_dark.svg"),
			class: "pin-icon"
		});
		var timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl, target: "_blank"});
		var thumbnailUrl = getVideoThumbnailUrl(note.videoId);
		var thumbnail = $(document.createElement("img")).attr({src: thumbnailUrl, class: "rn_thumbnail"});


		noteBodyContainer.append(thumbnail);

		if (note.timestamp >= 0) {
			var formattedTimestamp = formatTimestamp(note.timestamp);
			noteBody.append(timestamp.text(formattedTimestamp));

		}

		if (note.content.length > 0) {
			noteBody.text(note.content.trunc(55));
			addClassToHashtags(noteBody);
		} else {
			noteBody.append(pinIcon);
			noteBody.addClass("pin");
		}

		noteBodyContainer.append(noteBody);
		return noteBodyContainer;
	}
}

function getVideoThumbnailUrl(videoId) {
	return "https://i1.ytimg.com/vi/" + videoId +  "/mqdefault.jpg";
}