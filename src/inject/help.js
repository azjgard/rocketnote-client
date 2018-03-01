const buildHelpButton = () => {
	let youtubeNavButtons = $("#buttons").first();
	let helpButton = $(document.createElement("button")).attr("id", "rn_help-button");
	youtubeNavButtons.prepend(helpButton);
};

