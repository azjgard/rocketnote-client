$(() => {
	linkify.options.defaults.format = function(value) {
		return value.trunc(21);
	};

	chrome.runtime.sendMessage({type: 'getState'}, userProfile => {
		if (userProfile) {
			addRecentNotesToPopup();
			updateVersionNumber();
			chrome.storage.local.set({accountLevel: userProfile.accountLevel});
		}
	});
});

const addRecentNotesToPopup = () => {
	let recentNotesContainer = $("#recent-notes");

	chrome.runtime.sendMessage({type: "getRecentNotes"}, notes => {
		if (Object.keys(notes).length > 0) {
			let recentNotes = notes;
			if (recentNotes.length > 0) {
				recentNotes.map(function(note) {
					recentNotesContainer.append(buildNoteBody(note));
				});
			}
		} else {
			let onboardPlaceholder = $(document.createElement("div")).addClass("onboard-placeholder");
			let onboardText = $(document.createElement("p")).text("You have not added notes. ");
			let onboardLink = $(document.createElement("a")).text("Learn how.").attr({href: "https://getrocketnote.com/getting-started?ref=popup", target: "_blank"});

			onboardText.append(onboardLink).appendTo(onboardPlaceholder);
			recentNotesContainer.append(onboardPlaceholder);
		}
	});

	function buildNoteBody(note) {
		let noteBodyContainer = $(document.createElement("div")).addClass("recent-note");
		let noteContents = $(document.createElement("p")).addClass("recent-note-body");
		let noteBody = $(document.createElement("div")).addClass("note-body-container").append(noteContents);
		let videoUrl = "https://youtube.com/watch?v=" + note.videoId + "&t=" + note.timestamp + "s";
        let channelName = note.meta.channelName || "youtube.com";
        let channelUrl = note.meta.channelUrl || "https://youtube.com";
        let pinIcon = $(document.createElement("img")).attr({
			src: chrome.runtime.getURL("assets/img/thumbtack_dark.svg"),
			class: "pin-icon"
		});
        let timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl, target: "_blank"});
        let thumbnailUrl = getVideoThumbnailUrl(note.videoId);
        let thumbnail = $(document.createElement("img")).attr({src: thumbnailUrl, class: "rn_thumbnail"});
        let thumbnailTimestamp = $(document.createElement("a")).attr({href: videoUrl, target: "_blank"});

		thumbnail.appendTo(thumbnailTimestamp);

		noteBodyContainer.append(thumbnailTimestamp);

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
			let dateCreated = $(document.createElement("span")).attr({class: "rn_date-created", title: moment(note.createdAt).format('MMMM Do YYYY, h:mm a')}).text(moment(note.createdAt).fromNow());
			dateCreated.prepend($((document).createElement("a")).attr({href: channelUrl, class: "channel-name", target: "_blank"}).text(channelName));
			noteBodyContainer.append(dateCreated);
		}

		noteBodyContainer.append(noteBody);
		return noteBodyContainer;
	}
};

const updateVersionNumber = () => {
	let version = chrome.runtime.getManifest().version;
	$("#rn_version").text(version);
};