const getParameterByName = (name, url) => {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const getCurrentVideoId = () => {
	return getParameterByName("v");
};

const filterHashtags = string => {
	let regex = /(?:^|\W)#(\w+)(?!\w)/g, match, tags = [];
	while (match = regex.exec(string)) {
		tags.push(match[1]);
	}
	return tags;
};

const addClassToHashtags = note => {
	note.html(function (_, html) {
		return html.replace(/(\#\w+)/g, '<span class="rn_tag">$1</span>');
	});
};

const formatTimestamp = timestamp => {
	return String(moment.utc(timestamp * 1000).format('mm:ss'));
};

const shortcutKeyShouldBePrevented = event => {
	return $(event.target).closest("input")[0] || $(event.target).closest("textarea")[0] || $(event.target).closest("p[contenteditable]")[0];
};

const stopKeyboardShorcutsOnContentEditable = () => {
	$("body").on("keyup keypress keydown", e => {
		if ($("p[contenteditable]").is(":focus") && (e.keyCode !== 27 && e.keyCode !== 13)) {
			e.stopImmediatePropagation();
		}
	});
};

const swapImage = (img, src1, src2) => {
	let source1 = chrome.runtime.getURL("assets/img/" + src1);
	let source2 = chrome.runtime.getURL("assets/img/" + src2);

	if ($(img).attr("src") === source1) {
		$(img).attr("src", source2);
	} else {
		$(img).attr("src", source1);
	}
};

function checkElementIsInView(container, element) {
	let contHeight = container.height();
	let contTop = container.scrollTop();
	let contBottom = contTop + contHeight;
	let elemTop = $(element).offset().top - container.offset().top;
	let elemBottom = elemTop + $(element).height();
	let elementIsTooLow = elemBottom > contBottom;

	if (elementIsTooLow) {
		element[0].scrollIntoView(false);
	}
}

String.prototype.trunc = function (n) {
	return (this.length > n) ? this.substr(0, n - 1) + '...' : this;
};

linkify.options.defaults.format = function (value) {
	return value.trunc(21);
};