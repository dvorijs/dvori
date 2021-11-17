module.exports = () => ({
	onResponse: (res) => {
		try {
			res.data = JSON.parse(res.data);
			return res;
		} catch (e) {
			console.error("JSON.parse failed");
			console.error(e);
			// failed, just pass it on
			return res;
		}
	},
});
