const apiRequest = (method, relUrl, data) =>  {
  return new Promise(async (resolve, reject) => {
    const authorization = await getAuthToken();
    const settings = {
      method,
      url  : baseUrl + relUrl,
      data : JSON.stringify(data),
      headers: {
        authorization
      },
      contentType: "application/json"
    };
    $.ajax(settings).done(resolve);
  });
};

const api = {
  getProfile      : async () => await apiRequest('GET', '/users'),
  getNotes        : async () => await apiRequest('GET', '/notes'),
  getLimitedNotes  : async (limit, order) => await apiRequest('GET', '/notes?limit=' + limit + '&order=' + order),
  getNotesByVideo : async videoId => await apiRequest('GET', '/notes?videoId=' + videoId),
  deleteNote      : async noteId => await apiRequest('DELETE', '/notes/' + noteId),
  updateNote      : async (noteId, updatedNote) => await apiRequest('PUT', '/notes/' + noteId, updatedNote),
  storeNote       : async note => await apiRequest('POST', '/notes', note),
  sendFeedback    : async feedback => await apiRequest('POST', '/feedback', feedback),
  getFeedback     : async () => await apiRequest('GET', '/feedback'),
};

// await api.getProfile();

// await api.getNotes();

// await api.getNotes('dfgdkfgvbsdfnjk');

// await api.deleteNote(1);

// await api.updateNote(1, {
//   "content" : "lol I'm changing the content of this note"
// });

// await api.storeNote({
// 	"meta" : {
// 		"key" : "value",
// 		"random" : "data"
// 	},
// 	"tags" : "tag1 asdasdasdsdasd tag3",
// 	"content" : "Check out my asdasdasdasdas note!",
// 	"timestamp" : 10,
// 	"videoId" : "dsfgdfgdfgdfgdfgdfgdffd"
// });
