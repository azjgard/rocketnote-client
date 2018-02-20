const watchForPlaylist = () => {
	let playlistContainer = $("#container.ytd-playlist-panel-renderer");

	if (playlistContainer.length) {
		formatForPlaylist(playlistContainer);
		watchPlaylistTabsForChange(playlistContainer);
		watchKeysForTabToggle(49, 50); // `SHIFT + 1 for Notes tab, SHIFT + 2 for Playlist
	} else {
		setTimeout(watchForPlaylist, 1000);
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
	let secondaryTabContainer = $(document.createElement("div")).addClass("rn_tab-container");
	let secondaryTabRadio = $(document.createElement("input")).attr({
		type: "radio",
		class: "rn_tab-radio",
		id: "rn_secondary-radio",
		name: "rn_tabs",
	});
	let secondaryTab = $(document.createElement("label")).attr({class: "rn_tab", "for": "rn_secondary-radio"}).text("Playlist");

	noteTabContainer.append([noteTabRadio, noteTab]);
	secondaryTabContainer.append([secondaryTabRadio, secondaryTab]);

	tabs.append([noteTabContainer, secondaryTabContainer]);

	playlistContainer.height("430px");
	mainContainer.prepend(tabs);
};

const watchPlaylistTabsForChange = playlistContainer => {
	let playlistTabsSelector = ".rn_tab-radio";

	$(document).on("change", playlistTabsSelector, () => {
		playlistContainer.find(".header").toggle();
		$("#rn_widget").toggle();
		$("iron-list#items").toggle();
	});
};