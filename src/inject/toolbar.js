const watchMouseSelection = () => {
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

	$(document).bind("mouseup", e => {
		const pageX = e.pageX;
		const pageY = e.pageY;
		let selectedText = x.Selector.getSelected();
		if (!selectedText.isCollapsed && selectedText !== "") {
			$("#rn_tools").css({
				'left': pageX - 30,
				'top': pageY - 65,
			}).fadeIn(200);
		} else {
			$("#rn_tools").fadeOut(200);
		}
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
	let button = $(document.createElement("button"));
	let pinIcon = $(document.createElement("img")).attr("src", chrome.runtime.getURL("assets/img/thumbtack_dark.svg"));

	button.append(pinIcon);
	textPinTool.append(button);
	textPinTool.appendTo(toolbar);

	textPinTool.on("click", () => {
		let selection = window.getSelection().toString();
		addNote(false, selection);
		toolbar.hide();
	});
};