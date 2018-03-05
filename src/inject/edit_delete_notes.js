const editNote = e => {
	const existingNote = $(e.target).closest(".existing-note");
	const noteBody = existingNote.find("p");
	const editedNoteId = existingNote.attr("id").replace("rn_note-", "");
	const editedNote = {
		id: editedNoteId,
		content: noteBody.text(),
	};
	if (newTimestamp !== null) {
		editedNote.timestamp = newTimestamp;
	}

	existingNote.find(".rn_edit-buttons").remove();
	noteBody.attr("contenteditable", "false");

	if (noteBody.text().length <= 0) {
		const thumbtack = $(document.createElement("img")).attr({
			src: chrome.runtime.getURL("assets/img/thumbtack_light.svg"),
			class: "pin-icon"
		});

		noteBody.append(thumbtack);
	}

	chrome.runtime.sendMessage({type: "updateNote", note: editedNote}, editedNote => {
		chrome.storage.local.get({notes: {}}, result => {
			let notes = result.notes;
			for (let i = 0; i < notes.recent.length; i++) {
				if (notes.recent[i].id === editedNote.note.id) {
					notes.recent[i] = editedNote.note;
				}
			}

			chrome.storage.local.set({notes});
		});
	});

	chrome.storage.local.get({notes: {}}, result => {
		let notes = result.notes;
		let existingNotes = notes[getCurrentVideoId()] || [];

		existingNotes.map(({id}, i) => {
			if (parseInt(id) === parseInt(editedNoteId)) {
				notes[getCurrentVideoId()][i].content = noteBody.text();
				chrome.storage.local.set({notes});
				addClassToHashtags(noteBody);
				noteBody.linkify();
			}
		});
	});

	stopWatchingTimestamp();
};

const watchForCancelEditNote = () => {
	$(document).on("click", ".rn_cancel-edit-button", e => {
		cancelEdit($(e.target).closest(".existing-note").find("p"));
	});

	$(document).on("keyup", ".existing-note p[contenteditable]", e => {
		if (e.keyCode === 27) { // `ESC`
			cancelEdit(e.target);
		}
	});

	function cancelEdit(target) {
		$(target).attr("contenteditable", "false");
		chrome.storage.local.get({"editedNote": ''}, result => {
			if (result.editedNote.originalContents.length > 0) {
				$(target).text(result.editedNote.originalContents);
				addClassToHashtags($(target));
				$(target).linkify();
			} else if ($(target).is(":empty")) {
				const thumbtack = $(document.createElement("img")).attr({
					src: chrome.runtime.getURL("assets/img/thumbtack_light.svg"),
					class: "pin-icon",
				});

				$(target).append(thumbtack);
			}
			$(target).closest(".existing-note").find(".timestamp").attr({
				duration: result.editedNote.originalDuration,
			}).text(formatTimestamp(result.editedNote.originalDuration));
			$(target).closest(".existing-note").find(".rn_edit-buttons").remove();
		});

		stopWatchingTimestamp();
	}
};

const switchToEditNoteMode = e => {
	const existingNote = $(e.target).closest(".existing-note");
	const note = existingNote.find("p");
	const timestamp = existingNote.find("a").attr("duration");
	const noteContents = note.text();
	const submitEditButton = $(document.createElement("button"))
		.addClass("rn_confirm-edit-button rn_button-action")
		.text("Save Changes");
	const cancelEditButton = $(document.createElement("button"))
		.addClass("rn_cancel-edit-button rn_button-action gray")
		.text("Cancel");
	const editButtons = $(document.createElement("div")).addClass("rn_edit-buttons").append([cancelEditButton, submitEditButton]);
	const noteContainer = $("#rn_note-container");

	let editedNote = {
		originalContents: noteContents,
		originalDuration: timestamp,
	};

	turnOffAllOtherEditing();

	chrome.storage.local.set({editedNote});
	note.attr("contenteditable", "true");
	note.find(".pin-icon").remove();
	existingNote.append(editButtons);
	checkElementIsInView(noteContainer, $(".rn_edit-buttons"));
	setEndOfContentEditable(note[0]);
	noteContainer.removeClass("edit");
	startWatchingTimestamp(existingNote, timestamp);

	function setEndOfContentEditable(contentEditableElement) {
		let range = document.createRange();
		range.selectNodeContents(contentEditableElement);
		range.collapse(false);

		let selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	}

	function turnOffAllOtherEditing() {
		const allEditButtons = $(".rn_edit-buttons");
		const existingNotes = $(".existing-note");
		const existingNoteContents = existingNotes.find("p");

		allEditButtons.remove();
		existingNoteContents.attr("contenteditable", "false");
		existingNotes.map((noteIndex) => {
			let currentNote = $(existingNotes[noteIndex]);
			let originalContent = currentNote.attr("originalContent");
			let originalDuration = currentNote.find(".timestamp").attr("originalDuration");

			currentNote.find("p").text(originalContent);
			currentNote.find(".timestamp").attr("duration", originalDuration).text(formatTimestamp(originalDuration));

			if (currentNote.find("p").is(":empty")) {
				const thumbtack = $(document.createElement("img")).attr({
					src: chrome.runtime.getURL("assets/img/thumbtack_light.svg"),
					class: "pin-icon"
				});
				currentNote.find("p").append(thumbtack);
			}
		});

		stopWatchingTimestamp();
	}
};

const watchForEditNote = () => {
	$(document).on("keydown", "p[contenteditable]", e => {
		if (e.keyCode === 13 && !e.shiftKey) {
			editNote(e);
			e.preventDefault();
		}
	});

	$(document).on("click", ".rn_confirm-edit-button", e => {
		editNote(e);
	});
};

const watchButtonForEditNote = () => {
	$(document).on("click", ".rn_edit-button", (e) => {
		switchToEditNoteMode(e);
		swapImage($("#rn_enable-edit").find("img"), "settings_gray.svg", "checkmark_gray.svg");
	});

	$(document).on("dblclick", "#rn_note-container .existing-note", (e) => {
		if (!e.target.isContentEditable) {
			switchToEditNoteMode(e);
		}
	});
};

const watchEnableEditActions = keyCode => {
	$(document).keyup(function (e) {
		if (e.keyCode === keyCode && !shortcutKeyShouldBePrevented(e)) {
			enableEdit();
			swapImage($("#rn_enable-edit").find("img"), "settings_gray.svg", "checkmark_gray.svg");
		}
	});

	$(document).on("click", "#rn_enable-edit", () => {
		enableEdit();
		swapImage($("#rn_enable-edit").find("img"), "settings_gray.svg", "checkmark_gray.svg");
	});

	function enableEdit() {
		$("#rn_note-container").toggleClass("edit");
	}
};

const addEditActions = noteElements => {
	let editActions = $(document.createElement("div")).addClass("edit-actions");
	let editButton = $(document.createElement("div")).attr({class: "edit-action rn_edit-button"});
	let deleteButton = $(document.createElement("div")).attr({class: "edit-action rn_delete-button"});
	let editIcon = $(document.createElement("img")).attr({src: chrome.runtime.getURL("assets/img/edit.svg")});
	let trashIcon = $(document.createElement("img")).attr({src: chrome.runtime.getURL("assets/img/trash.svg")});

	editButton.append(editIcon);
	deleteButton.append(trashIcon);
	editActions.append([editButton, deleteButton]);

	noteElements.prepend(editActions);
};

const deleteNote = note => {
	const noteId = note.attr("id").replace("rn_note-", "");

	chrome.runtime.sendMessage({type: "deleteNote", noteId: noteId});

	chrome.runtime.sendMessage({type: "getNotesByVideo", currentVideoId: getCurrentVideoId()}, notes => {
		notes.map(({id}, i) => {
			if (parseInt(id) === parseInt(noteId)) {
				notes[i].index = i;
				updateLastDeleted(notes[i]);

				chrome.storage.local.get({notes: {}}, result => {
					result.notes[getCurrentVideoId()] = result.notes[getCurrentVideoId()] || [];
					result.notes[getCurrentVideoId()].splice(i, 1);
					chrome.storage.local.set({notes: result.notes});
				});
			}
		});
	});

	notifyDelete(note);
	note.remove();

	function notifyDelete(note) {
		let noteDeletedNotification = $(document.createElement("div")).addClass("rn_notify-deleted").text("Note deleted.");
		const undoAnchor = $(document.createElement("a")).attr({class: "rn_undo-action"}).text(" undo");

		$(".rn_notify-deleted").remove();

		noteDeletedNotification.append(undoAnchor);
		noteDeletedNotification.insertBefore(note);
	}
};

const watchForDeleteNote = () => {
	$(document).on("click", ".rn_delete-button", e => {
		deleteNote($(e.target).closest(".existing-note"));
	});
};

const undoAction = e => {
	let notifyBody = $(e.target).closest("div");

	chrome.storage.local.get({lastDeleted: {}}, lastDeletedResult => {
		let note = lastDeletedResult.lastDeleted;

		let existingNote = $(document.createElement("div")).attr({class: "existing-note", id: "rn_note-" + note.id});
		let noteBody = buildNoteBody(note);
		let videoUrl = "/watch?v=" + note.videoId + "&t=" + note.timestamp + "s";
		let timestamp = $(document.createElement("a")).attr({class: "timestamp yt-simple-endpoint", href: videoUrl});

		existingNote.append(noteBody);

		if (note.timestamp >= 0) {
			const formattedTimestamp = formatTimestamp(note.timestamp);
			existingNote.prepend(timestamp.text(formattedTimestamp));
		}

		addEditActions(existingNote);
		existingNote.insertBefore(notifyBody);
		notifyBody.remove();

		chrome.runtime.sendMessage({type: "undoDelete", note: note});

		chrome.storage.local.get({notes: {}}, notesResult => {
			let allNotes = notesResult.notes;
			allNotes[getCurrentVideoId()] = allNotes[getCurrentVideoId()] || [];
			allNotes[getCurrentVideoId()].splice(note.index, 0, note);

			chrome.storage.local.set({notes: allNotes});
		});
	});
};

const watchUndoAction = () => {
	$(document).on("click", ".rn_undo-action", e => {
		undoAction(e);
	});
};

function updateLastDeleted(note) {
	chrome.storage.local.set({lastDeleted: note});
}

function startWatchingTimestamp(note, timestamp) {
	const video = $("video")[0];
	const timestampAnchor = note.find("a");
	const currentVideoTime = $(".ytp-time-current");
	storedDuration = timestamp;

	setTimeout(() => {
		video.pause();
	}, 100);

	video.currentTime = timestamp;

	window.checkVideoTimestamp = setInterval(() => {
		newTimestamp = Math.floor(video.currentTime);
		timestampAnchor.attr("duration", newTimestamp);

		timestampAnchor.text(formatTimestamp(moment.duration(currentVideoTime.text()).asMinutes()));
	}, 300);

	showNotifyChangeTimestamp();

	function showNotifyChangeTimestamp() {
		$(".timestamp-notification").show();
	}
}

function stopWatchingTimestamp() {
	clearInterval(window.checkVideoTimestamp);
	newTimestamp = null;
	hideNotifyChangeTimestamp();

	function hideNotifyChangeTimestamp() {
		$(".timestamp-notification").hide();
	}
}