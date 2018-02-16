var baseURL = "http://node-express-env.8pzfqbf2pk.us-west-2.elasticbeanstalk.com/v1";

var requests = {
	getNotes: function() {
		$.ajax({
			url: baseURL + "/notes",
			success: function(response) {
				console.log(response);
				return response;
			}
		});
	},
	getNotesByVideoId: function(videoId) {
		$.ajax({
			url: baseURL + "/notes",
			data: {
				videoId: videoId
			}
		})
	}
};