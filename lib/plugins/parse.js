/*
	Uses the content type header to parse a response into a useable format

	ex:
		 if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
			let responseData = res.data.toString('utf-8')
		 }

*/
