const watchForPlaylist = () => {
	let playlistContainer = $("#container.ytd-playlist-panel-renderer");

	if (playlistContainer.length) {
		formatForPlaylist(playlistContainer);
	}
};

const formatForPlaylist = playlistContainer => {
	buildTabs(playlistContainer);

};

const buildTabs = playlistContainer => {
	let mainContainer = playlistContainer.parent();
	let tabs = $(document.createElement("div")).addClass("rn_tabs");
	let noteTabContainer = $(document.createElement("div")).addClass("rn_tab-container");
	let noteTabBox = $(document.createElement("input")).attr({
		type: "radio",
		class: "rn_tab-radio",
		id: "rn_notes-radio",
		checked: true,
		name: "rn_tabs",
	});
	let noteTab = $(document.createElement("label")).attr({class: "rn_tab", "for": "rn_notes-radio"}).text("Notes");
	let playlistTabContainer = $(document.createElement("div")).addClass("rn_tab-container");
	let playlistTabBox = $(document.createElement("input")).attr({
		type: "radio",
		class: "rn_tab-radio",
		id: "rn_playlist-radio",
		name: "rn_tabs",
	});
	let playlistTab = $(document.createElement("label")).attr({class: "rn_tab", "for": "rn_playlist-radio"}).text("Playlist");

	noteTabContainer.append([noteTabBox, noteTab]);
	playlistTabContainer.append([playlistTabBox, playlistTab]);

	tabs.append([noteTabContainer, playlistTabContainer]);

	playlistContainer.height("430px");
	mainContainer.prepend(tabs);
};