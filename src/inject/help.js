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
			$("#help-modal").find(".modal-sides").toggleClass("flipped");
		});
	}
};

const buildHelpModal = () => {
	let helpModal = $(document.createElement("div")).attr({id: "help-modal"});
	let modalBody = $(document.createElement("div")).attr({class: "modal-body"});
	let modalSides = $(document.createElement("div")).attr({class: "modal-sides"});
	let modalDocs = $(document.createElement("div")).attr({class: "modal-docs"});
	let modalShortcuts = $(document.createElement("div")).attr({class: "modal-shortcuts"});

	let logoContainer = $(document.createElement("div")).attr({
		class: "modal-logo-container",
	});
	let logo = $(document.createElement("img")).attr({
		src: chrome.runtime.getURL("assets/img/rocket_note_main_logo.svg"),
		class: "modal-logo",
	});
	let flipButton = $(document.createElement("a")).attr({class: "flip-modal right", href: "javascript:void(0);"}).html("View Keyboard Shortcuts &rarr;");
	let docsContainer = $(document.createElement("div")).attr({class: "container"});
	let columnsDocs = $(document.createElement("div")).attr({class: "columns"});
	let columnLeftDocs = $(document.createElement("div")).attr({class: "column"});
	let columnRightDocs = $(document.createElement("div")).attr({class: "column"});

	let shortcutsContainer = docsContainer.clone();

	docsContainer.appendTo(modalDocs);
	shortcutsContainer.appendTo(modalShortcuts);
	modalSides.append([modalDocs, modalShortcuts]).appendTo(modalBody);
	logoContainer.append(logo).appendTo(docsContainer);
	flipButton.appendTo(docsContainer).clone().removeClass("right").html("&larr; Back To Documentation").addClass("left").appendTo(shortcutsContainer);
	columnsDocs.append([columnLeftDocs, columnRightDocs]).appendTo(docsContainer);

	buildShortcuts(shortcutsContainer);
	

	helpModal.append(modalBody).hide().appendTo($("body"));

	function buildShortcuts(container) {
		shortcuts.map(({key, title, description}) => {
			let shortcutBlock = $(document.createElement("div")).attr({class: "shortcut"});
			let shortcutKey = $(document.createElement("span")).text(key).addClass("keyboard-key");
			let shortcutTitle = $(document.createElement("h1")).text(title).addClass("shortcut-title");
			let shortcutDescription = $(document.createElement("p")).text(description).addClass("shortcut-description");

			shortcutTitle.append(shortcutKey);
			shortcutBlock.append([shortcutTitle, shortcutDescription]);
			shortcutBlock.appendTo(container);
		});
	}
};