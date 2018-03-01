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

	watchShowHelpModal();
	watchHideHelpModal();
	watchFlipHelpModal();

	function watchShowHelpModal() {
		$(document).on("click", "#rn_help-button", () => {
			showHelpModal();
		});

		$(document).on("keyup", e => {
			// on press "z" key, fade in modal
			if (e.keyCode === 90 && !shortcutKeyShouldBePrevented(e)) {
				showHelpModal();
			}
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

		$(document).on("keyup", e => {
			// on press "ESC" key, fade out modal
			if (e.keyCode === 27 && !shortcutKeyShouldBePrevented(e)) {
				const video = $("video")[0];
				if (!wasPaused) {
					video.play();
				}

				$("#help-modal").fadeOut();
			}
		});

		$(document).on("click", "#help-modal .modal-body", e => {
			e.stopPropagation();
		});
	}

	function watchFlipHelpModal() {
		$(document).on("click", ".flip-modal", ()=> {

		});
	}
};

const buildHelpModal = () => {
	let helpModal = $(document.createElement("div")).attr({id: "help-modal"});
	let modalBody = $(document.createElement("div")).attr({class: "modal-body"});
	let logoContainer = $(document.createElement("div")).attr({
		class: "modal-logo-container",
	});
	let logo = $(document.createElement("img")).attr({
		src: chrome.runtime.getURL("assets/img/rocket_note_main_logo.svg"),
		class: "modal-logo",
	});

	logoContainer.append(logo).appendTo(modalBody);
	helpModal.append(modalBody).hide().appendTo($("body"));
};