function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCurrentVideoId() {
	return getParameterByName("v");
}

function filterHashtags(string) {
	var re = /(?:^|\W)#(\w+)(?!\w)/g, match, tags = [];
	while (match = re.exec(string)) {
		tags.push(match[1]);
	}

	return tags;
}

function addClassToHashtags(note) {
	note.html(function (_, html) {
		return html.replace(/(\#\w+)/g, '<span class="rn_tag">$1</span>');
	});
}

function formatTimestamp(timestamp) {
	return String(moment.utc(timestamp * 1000).format('mm:ss'));
}