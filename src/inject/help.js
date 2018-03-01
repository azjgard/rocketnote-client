const buildHelpButton = () => {
	let navCheck = setInterval(() => {
		if ($("#rn_help-button").length <= 0) {
			let youtubeNavButtons = $("#buttons").first();
			let helpButton = $(document.createElement("button")).attr("id", "rn_help-button");
			youtubeNavButtons.prepend(helpButton);
		}
	}, 500);

	setTimeout(() => {
		clearInterval(navCheck);
	}, 5000);
};