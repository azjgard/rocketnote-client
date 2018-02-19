function watchForPlaylist() {
	var playlistContainer = $("#container.ytd-playlist-panel-renderer");
	if (playlistContainer.length) {
		console.log("It's for sure got a playlist...");
		formatForPlaylist(playlistContainer);
	} else {
		console.log("I thought you said it was a playlist... :(");
	}
}

function formatForPlaylist(playlistContainer) {
	var mainContainer = playlistContainer.parent();
	var tabs = $(document.createElement("div")).height("50px").text("TABS!");

	playlistContainer.height("430px");
	mainContainer.prepend(tabs);
}