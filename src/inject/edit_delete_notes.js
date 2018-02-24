const editNote = e => {
	const existingNote = $(e.target).closest(".existing-note");
	const noteBody = existingNote.find("p");
	const confirmButton = existingNote.find(".rn_confirm-edit-button");
	const cancelButton = existingNote.find(".rn_cancel-edit-button");
	const editedNoteId = existingNote.attr("id").replace("rn_note-", "");

	confirmButton.remove();
	cancelButton.remove();
	noteBody.attr("contenteditable", "false");

	chrome.storage.sync.get({notes: {}}, result => {
		let notes = result.notes;
		let existingNotes = notes[getCurrentVideoId()] || [];
		existingNotes.map(({id}, i) => {
			if (parseInt(id) === parseInt(editedNoteId)) {
				notes[getCurrentVideoId()][i].content = $(noteBody).text();
				chrome.storage.sync.set({notes});
				addClassToHashtags(noteBody);
				noteBody.linkify();
			}
		});
	});
};

const watchCancelEditNote = () => {
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
		chrome.storage.sync.get({"editedNote": ''}, result => {
			if (result.editedNote.originalContents.length > 0) {
				$(target).text(result.editedNote.originalContents);
				addClassToHashtags($(target));
				$(target).linkify();
			} else if ($(target).is(":empty")) {
				const thumbtack = $(document.createElement("img")).attr({
					src: chrome.runtime.getURL("assets/img/thumbtack_light.svg"),
					class: "pin-icon"
				});

				$(target).append(thumbtack);
			}

			$(target).closest(".existing-note").find(".rn_confirm-edit-button").remove();
			$(target).closest(".existing-note").find(".rn_cancel-edit-button").remove();
		});
	}
};

const switchToEditNoteMode = e => {
	const existingNote = $(e.target).closest(".existing-note");
	const note = existingNote.find("p");
	const noteContents = note.text();
	const submitEditButton = $(document.createElement("button"))
		.addClass("rn_confirm-edit-button rn_button-action")
		.text("Save Changes");
	const cancelEditButton = $(document.createElement("button"))
		.addClass("rn_cancel-edit-button rn_button-action gray")
		.text("Cancel");
	const editButtons = $(document.createElement("div")).addClass("rn_edit-buttons").append([cancelEditButton, submitEditButton]);

	let editedNote = {
		originalContents: noteContents,
	};

	turnOffAllOtherEditing();

	chrome.storage.sync.set({editedNote});
	note.attr("contenteditable", "true");
	existingNote.append(editButtons);
	setEndOfContentEditable(note[0]);
	$("#rn_note-container").removeClass("edit");

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
	});

	$(document).on("dblclick", "#rn_note-container .existing-note", (e) => {
		if (!e.target.isContentEditable) {
			switchToEditNoteMode(e);
		}
	});
};

const watchKeyToEnableEditActions = keyCode => {
	$(document).keyup(function (e) {
		if (e.keyCode === keyCode && !shortcutKeyShouldBePrevented(e)) {
			$("#rn_note-container").toggleClass("edit");
		}
	});
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

	noteElements.append(editActions);
};

const askConfirmDeleteNote = note => {

};

const deleteNote = note => {

};

const watchKeyForDeleteNote = keyCode => {

};