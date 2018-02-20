const moveWidgetUnderTab = playlistContainer => {
	let widget = $("#rn_widget");
	let playlistItems = $("iron-list#items");
	let noteContainer = $("#rn_note-container");

	widget.css("border-top", 0);
	playlistContainer.find(".header").hide();
	playlistItems.hide();
	noteContainer.height("290px");
	widget.appendTo(playlistContainer);
};

const watchKeysForTabToggle = (keyCode1, keyCode2) => {
	$(document).keyup(function (e) {
		if (e.shiftKey) {
			if (e.keyCode === keyCode1) {
				$("#rn_notes-radio").click();
			} else if (e.keyCode === keyCode2) {
				$("#rn_secondary-radio").click();
			}
		}
	})
};