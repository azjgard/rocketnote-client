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
		return;
	}
	swapImage($("#rn_youtube-control"), "rocket_white.svg", "rocket_red.svg");
	$("#rn_widget").fadeToggle();

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

	watchFullScreenButtonForClick();
};

const watchFullScreenButtonForClick = () => {
	$(document).on("click", ".ytp-fullscreen-button", () => {
		if ($(".ytp-big-mode").length) {
			$("#rn_youtube-control-button").fadeIn();
		} else {
			$("#rn_youtube-control-button").fadeOut();
		}
	});

	watchKeyForShowCollapseButton(27); // `ESC`
};

const watchKeyForShowCollapseButton = keyCode => {
	$(document).keyup(function (e) {
		if (e.keyCode === keyCode) {
			if ($(".ytp-big-mode").length) {
				$("#rn_youtube-control-button").fadeIn();
			}
		}
	})
};