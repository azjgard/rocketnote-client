let loggedIn = null;
let currentTimestamp = null;
let newTimestamp = null;
let storedDuration = null;

getLoginState();

chrome.runtime.sendMessage({
	type: 'showPageAction'
}, () => {
	let readyStateCheckInterval = setInterval(() => {
		if (document.readyState === "complete") {
			if ($("#related").length) {
				initRocketNote();
			}

			function initRocketNote() {
				let currentVideoId = getCurrentVideoId();
				clearInterval(readyStateCheckInterval);
				buildWidget();
				buildHelpModal();
				addRocketLogoToPlayerControls();
				initWatchers();
				watchVideoForChanges(currentVideoId);
				stopKeyboardShorcutsOnContentEditable();
				buildHelpButton();
				buildTimestampNotification();

				function watchVideoForChanges(currentVideoId) {
					setInterval(() => {
						if (currentVideoId !== getCurrentVideoId()) {
							refreshWidget();
							buildHelpButton();
							buildTimestampNotification();
							currentVideoId = getCurrentVideoId();
						}
					}, 1000);
				}
			}
		}
	}, 1000);
});

function refreshWidget() {
	let container = $("#rn_note-container");
	container.empty();
	buildExistingNotes(container);
}

function buildTimestampNotification() {
	$(".timestamp-notification").remove();

	const playerContainer = $("#player-container");
	const timestampNotification = $(document.createElement("div")).addClass("timestamp-notification");
	const notification = $(document.createElement("p"))
		.text("Your note is in editing mode. Change this note's timestamp by adjusting the current time the video is at (red timeline below).");
	timestampNotification.append(notification).appendTo(playerContainer);
}

function getLoginState() {
	chrome.storage.sync.get("auth_token", result => {
		loggedIn = result.auth_token !== null;
	});
}