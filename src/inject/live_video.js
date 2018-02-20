const watchForLiveVideo = () => {
	let liveVideoContainer = $("#chat");

	if (liveVideoContainer.length) {
		formatForChat(liveVideoContainer);
		watchChatTabsForChange(liveVideoContainer);
		watchKeysForTabToggle(49, 50); // `SHIFT + 1 for Notes tab, SHIFT + 2 for Playlist
	} else {
		setTimeout(watchForLiveVideo, 1000);
	}
};

const formatForChat = liveVideoContainer => {
	buildTabs(liveVideoContainer);
	moveWidgetUnderTab(liveVideoContainer);

	function buildTabs(container) {
		let mainContainer = container;
		let chatFrame = mainContainer.find("iframe");
		let tabs = $(document.createElement("div")).addClass("rn_tabs");
		let noteTabContainer = $(document.createElement("div")).addClass("rn_tab-container");
		let noteTabRadio = $(document.createElement("input")).attr({
			type: "radio",
			class: "rn_tab-radio",
			id: "rn_notes-radio",
			checked: true,
			name: "rn_tabs",
		});
		let noteTab = $(document.createElement("label")).attr({
			class: "rn_tab",
			for: "rn_notes-radio"
		}).text("Notes");
		let secondaryTabContainer = $(document.createElement("div")).addClass("rn_tab-container");
		let secondaryTabRadio = $(document.createElement("input")).attr({
			type: "radio",
			class: "rn_tab-radio",
			id: "rn_secondary-radio",
			name: "rn_tabs",
		});
		let secondaryTab = $(document.createElement("label")).attr({
			class: "rn_tab",
			"for": "rn_secondary-radio"
		}).text("Live Chat");

		noteTabContainer.append([noteTabRadio, noteTab]);
		secondaryTabContainer.append([secondaryTabRadio, secondaryTab]);

		tabs.append([noteTabContainer, secondaryTabContainer]);

		chatFrame.css({height: "430px", display: "inline"}).hide();
		$("#show-hide-button").hide();
		mainContainer.prepend(tabs);
	}
};

const watchChatTabsForChange = liveVideoContainer => {
	let chatTabsSelector = ".rn_tab-radio";

	$(document).on("change", chatTabsSelector, () => {
		liveVideoContainer.find("iframe").toggle();
		$("#rn_widget").toggle();
		$("#show-hide-button").toggle();
	});
};