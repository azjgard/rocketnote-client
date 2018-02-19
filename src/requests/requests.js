const baseURL = "http://node-express-env.8pzfqbf2pk.us-west-2.elasticbeanstalk.com/v1";

const requests = {
	getNotes: () => {
		$.ajax({
			method: "GET",
			url: baseURL + "/notes",
		}).then(function(response) {
			console.log(response);
		});
	},
	getNotesByVideoId: videoId => {
		$.ajax({
			method: "GET",
			url: baseURL + "/notes",
			data: {
				videoId: videoId
			},
		})
	}
};