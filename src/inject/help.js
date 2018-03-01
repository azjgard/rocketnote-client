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


const watchHelpModal = () => {
	let wasPaused = false;

	watchClickHelpButton();
	watchHideHelpModal();

	function watchClickHelpButton() {
		$(document).on("click", "#rn_help-button", () => {
			showHelpModal();
		});
	}

	function showHelpModal() {
		const video = $("video")[0];
		if (video.paused) {
			wasPaused = true;
		} else {
			video.pause();
			wasPaused = false;
		}

		$("#help-modal").fadeIn();
	}

	function watchHideHelpModal() {
		$(document).on("click", "#help-modal", () => {
			const video = $("video")[0];
			if (!wasPaused) {
				video.play();
			}

			$("#help-modal").fadeOut();
		});

		$(document).on("click", "#help-modal .modal-body", e => {
			e.stopPropagation();
		});
	}
};

const buildHelpModal = () => {
	let helpModal = $(document.createElement("div")).attr({id: "help-modal"});
	let modalBody = $(document.createElement("div")).attr({class: "modal-body"});

	helpModal.append(modalBody).hide().appendTo($("body"));
};