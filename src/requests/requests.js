const baseURL = "https://api.getrocketnote.com/v1";

const requests = {
	getNotes: () => {
		$.ajax({
			method: "GET",
			url: baseURL + "/notes",
		}).then(response => {
			return response;
		});
	},
	getNotesByVideoId: videoId => {
		$.ajax({
			method: "GET",
			url: baseURL + "/notes",
			data: {
				videoId: videoId
			},
		}).then(response => {
			return response
		});
	}
};