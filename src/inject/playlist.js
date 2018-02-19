watchForPlaylist = () => {
	let playlistContainer = $("#container.ytd-playlist-panel-renderer");
	if (playlistContainer.length) {
		formatForPlaylist(playlistContainer);
	} else {

	}
};

formatForPlaylist = playlistContainer => {
	let mainContainer = playlistContainer.parent();
	let tabs = $(document.createElement("div")).height("50px").text("TABS!");

	playlistContainer.height("430px");
	mainContainer.prepend(tabs);
};