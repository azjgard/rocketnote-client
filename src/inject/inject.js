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
				addRocketLogoToPlayerControls();
				initWatchers();
				watchVideoForChanges(currentVideoId);
				stopKeyboardShorcutsOnContentEditable();

				function watchVideoForChanges(currentVideoId) {
					setInterval(() => {
						if (currentVideoId !== getCurrentVideoId()) {
							refreshWidget();
							currentVideoId = getCurrentVideoId();
						}
					}, 1000);
				}
			}
		}
	}, 1000);
});

const refreshWidget = () => {
	let container = $("#rn_note-container");
	container.empty();
	buildExistingNotes(container);
};