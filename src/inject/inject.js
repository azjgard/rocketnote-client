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
							$("#rn_widget").remove();

							buildWidget();
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

function getLoginState() {
	chrome.storage.sync.get("auth_token", result => {
		loggedIn = result.auth_token !== null;
	});
}