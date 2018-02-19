function watchForPlaylist() {
	var playlistContainer = $("#container.ytd-playlist-panel-renderer");
	if (playlistContainer.length) {
		formatForPlaylist(playlistContainer);
	} else {

	}
}

function formatForPlaylist(playlistContainer) {
	var mainContainer = playlistContainer.parent();
	var tabs = $(document.createElement("div")).height("50px").text("TABS!");

	playlistContainer.height("430px");
	mainContainer.prepend(tabs);
}