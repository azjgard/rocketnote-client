const watchMouseSelection = () => {
	let pageX;
	let pageY;

	initToolbar();

	if (!window.x) {
		x = {};
	}

	x.Selector = {};
	x.Selector.getSelected = () => {
		let selection = '';
		if (window.getSelection) {
			selection = window.getSelection();
		} else if (document.getSelection) {
			selection = document.getSelection();
		} else if (document.selection) {
			selection = document.selection.createRange().text;
		}
		return selection;
	};

	$(document).bind("mouseup", () => {
		let selectedText = x.Selector.getSelected();
		console.log(selectedText);
		if (!selectedText.isCollapsed) {
			$("#rn_tools").css({
				'left': pageX + 5,
				'top': pageY - 55,
			}).fadeIn(200);
		} else {
			$("#rn_tools").fadeOut(200);
		}
	});

	$(document).on("mousedown", e => {
		pageX = e.pageX;
		pageY = e.pageY;
	});
};

const initToolbar = () => {
	let toolbar = $(document.createElement("ul")).attr({
		id: "rn_tools",
	});

	addTextPinToToolbar(toolbar);
	$("body").append(toolbar);
};

const addTextPinToToolbar = toolbar => {
	let textPinTool = $(document.createElement("li")).attr({
		id: "rn_text-pin-tool",
	});
	let pinIcon = $(document.createElement("img")).attr("src", chrome.runtime.getURL("assets/img/thumbtack_dark.svg"));

	textPinTool.append(pinIcon);
	textPinTool.appendTo(toolbar);

	textPinTool.on("click", () => {
		let selection = window.getSelection().toString();
		addNote(false, selection);
	});
};