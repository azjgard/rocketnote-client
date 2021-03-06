let wasPaused = false;

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
	watchShowHelpModal();
	watchHideHelpModal();
	watchFlipHelpModal();
	watchClickFeatures();
	watchTargetSelectors();

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
			hideHelpModal();
		});

		$(document).on("keyup", e => {
			// on press "ESC" key, fade out modal
			if (e.keyCode === 27 && !shortcutKeyShouldBePrevented(e)) {
				hideHelpModal();
			}
		});

		$(document).on("click", "#help-modal .modal-body", e => {
			e.stopPropagation();
		});
	}

	function watchFlipHelpModal() {
		$(document).on("click", ".flip-modal", () => {
			$("#help-modal").find(".modal-sides").toggleClass("flipped");
		});
	}
};

const hideHelpModal = () => {
	const video = $("video")[0];
	if (!wasPaused) {
		video.play();
	}

	$("#help-modal").fadeOut();
};

const buildHelpModal = () => {
	let helpModal = $(document.createElement("div")).attr({id: "help-modal"});
	let modalBody = $(document.createElement("div")).attr({class: "modal-body"});
	let modalSides = $(document.createElement("div")).attr({class: "modal-sides"});
	let modalDocs = $(document.createElement("div")).attr({class: "modal-docs"});
	let featuresContainer = $(document.createElement("div"));
	let modalShortcuts = $(document.createElement("div")).attr({class: "modal-shortcuts"});

	let logoContainer = $(document.createElement("div")).attr({
		class: "modal-logo-container",
	});
	let logo = $(document.createElement("img")).attr({
		src: chrome.runtime.getURL("assets/img/rocket_red.svg"),
		class: "modal-logo",
	});
	let flipButton = $(document.createElement("a")).attr({
		class: "flip-modal right",
		href: "javascript:void(0);"
	}).html("View Keyboard Shortcuts &rarr;");
	let docsContainer = $(document.createElement("div")).attr({class: "container"});
	let docsTitle = $(document.createElement("h1")).addClass("section-header").text("Documentation");
	let shortcutsTitle = docsTitle.clone().text("Keyboard Shortcuts");

	let shortcutsContainer = docsContainer.clone();

	docsContainer.appendTo(modalDocs);
	shortcutsContainer.appendTo(modalShortcuts);
	modalSides.append([modalDocs, modalShortcuts]).appendTo(modalBody);
	logoContainer.append(logo).appendTo(docsContainer);
	flipButton.appendTo(docsContainer).clone().removeClass("right").html("&larr; Back To Documentation").addClass("left").appendTo(shortcutsContainer);

	buildFeatures(featuresContainer);
	docsContainer.append([docsTitle, featuresContainer]);

	shortcutsContainer.append(shortcutsTitle);
	buildShortcuts(shortcutsContainer);

	helpModal.append(modalBody).hide().appendTo($("body"));

	function buildFeatures(container) {
		docs.features.map(({title, description, targetSelector = "", id, addToInput = ""}) => {
			let featureColumns = $(document.createElement("div")).attr({class: "columns"});
			let featureColumnLeft = $(document.createElement("div")).attr({class: "column left"});
			let featureColumnRight = $(document.createElement("div")).attr({class: "column right"});
			let featureBlock = $(document.createElement("div")).attr({class: "feature", id: "feature-" + id});
			if (addToInput.length > 0) {
				featureBlock.attr({addToInput});
			}
			let featureTitle = $(document.createElement("h3"));
			if (targetSelector.length > 0) {
				featureTitle.addClass("feature-title").html(
					title + " <span class=\"show-me\" targetSelector=\"" + targetSelector + "\">I can't find this feature.</span>"
				);
			} else {
				featureTitle.addClass("feature-title").text(title);
			}
			let featureDescription = $(document.createElement("p")).attr({description}).addClass("feature-description").html(displaySpaces(description.trunc(64) + "\n\n(Show More)"));

			featureColumns.append([featureColumnLeft, featureColumnRight]);
			featureColumnLeft.append([featureTitle, featureDescription]);
			featureBlock.append(featureColumns);
			container.append(featureBlock);
		});
	}

	function buildShortcuts(container) {
		docs.shortcuts.map(({key, title, description}) => {
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

const watchClickFeatures = () => {
	$(document).on("click", ".modal-docs .feature *", e => {
		let target = $(e.target).closest(".feature").find("p");
		let targetShortText = target.html();
		let description = "";
		if (target.hasClass("long-form")) {
			description = displaySpaces(target.attr("description") + "\n\n(Show More)");
		} else {
			description = displaySpaces(target.attr("description") + "\n\n(Show Less)");
		}

		target.attr("description", targetShortText.replace("<br><br>(Show More)", "").replace("<br><br>(Show Less)", "")).toggleClass("long-form");
		target.html(description);
	});
};

const watchTargetSelectors = () => {
	$(document).on("click", ".show-me", e => {
		targetSelector = $(e.target).attr("targetSelector");
		hideHelpModal();
		$(targetSelector).addClass("help-target").focus();
		if ($(e.target).closest(".feature").attr("addtoinput")) {
			$("#rn_note-input").text($(e.target).closest(".feature").attr("addtoinput"));
			$(targetSelector).keyup();
		}
		setTimeout(() => {
			$(targetSelector).removeClass("help-target");
		}, 3000);

	});
};