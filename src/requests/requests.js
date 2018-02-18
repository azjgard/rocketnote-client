var baseURL = "http://node-express-env.8pzfqbf2pk.us-west-2.elasticbeanstalk.com/v1";

var requests = {
	getNotes: function() {
		$.ajax({
			method: "GET",
			url: baseURL + "/notes"
		}).then(function(response) {
			console.log(response);
		});
	},
	getNotesByVideoId: function(videoId) {
		$.ajax({
			method: "GET",
			url: baseURL + "/notes",
			data: {
				videoId: videoId
			}
		})
	}
};