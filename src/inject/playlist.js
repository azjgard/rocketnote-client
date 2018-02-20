const watchForPlaylist = () => {
	let playlistContainer = $("#container.ytd-playlist-panel-renderer");

	if (playlistContainer.length) {
		formatForPlaylist(playlistContainer);
		watchPlaylistTabsForChange(playlistContainer);
		watchKeysForTabToggle(49, 50); // `SHIFT + 1 for Notes tab, SHIFT + 2 for Playlist
	}
};

const formatForPlaylist = playlistContainer => {
	buildTabs(playlistContainer);
	moveWidgetUnderTab(playlistContainer);
};

const buildTabs = playlistContainer => {
	let mainContainer = playlistContainer.parent();
	let tabs = $(document.createElement("div")).addClass("rn_tabs");
	let noteTabContainer = $(document.createElement("div")).addClass("rn_tab-container");
	let noteTabRadio = $(document.createElement("input")).attr({
		type: "radio",
		class: "rn_tab-radio",
		id: "rn_notes-radio",
		checked: true,
		name: "rn_tabs",
	});
	let noteTab = $(document.createElement("label")).attr({class: "rn_tab", "for": "rn_notes-radio"}).text("Notes");
	let playlistTabContainer = $(document.createElement("div")).addClass("rn_tab-container");
	let playlistTabRadio = $(document.createElement("input")).attr({
		type: "radio",
		class: "rn_tab-radio",
		id: "rn_playlist-radio",
		name: "rn_tabs",
	});
	let playlistTab = $(document.createElement("label")).attr({class: "rn_tab", "for": "rn_playlist-radio"}).text("Playlist");

	noteTabContainer.append([noteTabRadio, noteTab]);
	playlistTabContainer.append([playlistTabRadio, playlistTab]);

	tabs.append([noteTabContainer, playlistTabContainer]);

	playlistContainer.height("430px");
	mainContainer.prepend(tabs);
};

const moveWidgetUnderTab = playlistContainer => {
	let widget = $("#rn_widget");
	let playlistItems = $("#items");
	let noteContainer = $("#rn_note-container");

	widget.css("border-top", 0);
	playlistContainer.find(".header").hide();
	playlistItems.hide();
	noteContainer.height("290px");
	widget.appendTo(playlistContainer);
};

const watchPlaylistTabsForChange = playlistContainer => {
	let playlistTabsSelector = ".rn_tab-radio";

	$(document).on("change", playlistTabsSelector, e => {
		playlistContainer.find(".header").toggle();
		$("#rn_widget").toggle();
		$("#items").toggle();
	});
};

const watchKeysForTabToggle = (keyCode1, keyCode2) => {
	$(document).keyup(function (e) {
		if (e.shiftKey) {
			if (e.keyCode === keyCode1) {
				$("#rn_notes-radio").click();
			} else if (e.keyCode === keyCode2) {
				$("#rn_playlist-radio").click();
			}
		}
	})
};