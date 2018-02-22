const watchKeyForCollapseNotes = keyCode => {
	$(document).on("keyup", e => {
		if (e.keyCode === keyCode && !shortcutKeyShouldBePrevented(e)) {
			toggleCollapseNotes();
		}
	});
};

const watchClickForCollapseNotes = () => {
	$(document).on("click", "#rn_youtube-control-button", () => {
		toggleCollapseNotes();
	});
};

const toggleCollapseNotes = () => {
	if (isChatOrPlaylist()) {
		return; // Disable collapsing if video is live or playlist.
	}
	swapLogoColor();
	$("#rn_widget").fadeToggle();

	function swapLogoColor() {
		let youtubeControl = $("#rn_youtube-control");
		let whiteLogo = chrome.runtime.getURL("assets/img/rocket_white.svg");
		let redLogo = chrome.runtime.getURL("assets/img/rocket_red.svg");

		if (youtubeControl.attr("src") === whiteLogo) {
			youtubeControl.attr("src", redLogo);
		} else {
			youtubeControl.attr("src", whiteLogo);
		}
	}

	function isChatOrPlaylist() {
		return $("#chat").length || $("#container.ytd-playlist-panel-renderer").length;
	}
};

const addRocketLogoToPlayerControls = () => {
	let button = $(".ytp-size-button").clone().attr("id", "rn_youtube-control-button");
	let rocketLogo = $(document.createElement("img")).attr({
		src: chrome.runtime.getURL("assets/img/rocket_red.svg"),
		id: "rn_youtube-control"
	});

	button.find("svg").remove();
	button.append(rocketLogo);
	$(".ytp-right-controls").prepend(button);
};