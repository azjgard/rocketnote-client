const editNote = note => {

};

const deleteNote = note => {

};

const switchToEditNoteMode = (e) => {
	const existingNote = $(e.target).closest(".existing-note");
	const editIcon = $(e.target).find("img");
	const note = existingNote.find("p");
	const noteContents = note.text();
	const noteTimestamp = note.find("a");
	const noteBody = noteContents.substring(5);
	const input = $(document.createElement("textarea")).text(noteBody);

	$(note).attr("contenteditable", "true");
};

const confirmDeleteNote = note => {

};

const watchKeyForEditNote = keyCode => {

};

const watchButtonForEditNote = () => {
	$(document).on("click", ".rn_edit-button", (e) => {
		switchToEditNoteMode(e);
	});
};

const watchKeyForDeleteNote = keyCode => {

};

const watchKeyToEnableEditActions = keyCode => {
	$(document).keyup(function (e) {
		if (e.keyCode === keyCode && !shortcutKeyShouldBePrevented(e)) {
			$("#rn_note-container").toggleClass("edit");

			if ($(".edit-actions").length <= 0) {
				addEditActions();
			}
		}
	});
};

function addEditActions() {
	let existingNotes = $(".existing-note");
	let editActions = $(document.createElement("div")).addClass("edit-actions");
	let editButton = $(document.createElement("div")).attr({class: "edit-action rn_edit-button"});
	let deleteButton = $(document.createElement("div")).attr({class: "edit-action rn_delete-button"});
	let editIcon = $(document.createElement("img")).attr({src: chrome.runtime.getURL("assets/img/edit.svg")});
	let trashIcon = $(document.createElement("img")).attr({src: chrome.runtime.getURL("assets/img/trash.svg")});

	editButton.append(editIcon);
	deleteButton.append(trashIcon);
	editActions.append([editButton, deleteButton]);

	existingNotes.append(editActions);
}