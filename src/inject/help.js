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

const watchClickHelpButton = () => {
	$(document).on("click", "#rn_help-button", () => {
		showHelpModal();
	});
};

const showHelpModal = () => {
	$("#help-modal").fadeIn();
};

const watchHideHelpModal = () => {
	$(document).on("click", "#help-modal", () => {
		$("#help-modal").fadeOut();
	});

	$(document).on("click", "#help-modal .modal-body", e => {
		e.stopPropagation();
	});
};

const buildHelpModal = () => {
	let helpModal = $(document.createElement("div")).attr({id: "help-modal"});
	let modalBody = $(document.createElement("div")).attr({class: "modal-body"});

	helpModal.append(modalBody).appendTo($("body"));
};