const moveWidgetUnderTab = playlistContainer => {
	let widget = $("#rn_widget");
	let playlistItems = $("iron-list#items");
	let noteContainer = $("#rn_note-container");

	widget.css("border-top", 0);
	playlistContainer.find(".header").hide();
	playlistItems.hide();
	noteContainer.height("266px");
	widget.appendTo(playlistContainer);
};

const reformatWidgetForNormalVideo = () => {
	let widget = $("#rn_widget");
	let noteContainer = $("#rn_note-container");
	let related = $("#related");

	widget.css("border-top", "2px solid var(--red-color)");
	noteContainer.height("340px");
	widget.prependTo(related);
};

const watchKeysForTabToggle = (keyCode1, keyCode2) => {
	$(document).keyup(function (e) {
		if (e.shiftKey && !shortcutKeyShouldBePrevented(e)) {
			if (e.keyCode === keyCode1) {
				$("#rn_notes-radio").click();
			} else if (e.keyCode === keyCode2) {
				$("#rn_secondary-radio").click();
			}
		}
	})
};