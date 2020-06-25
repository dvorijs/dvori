const debug = require("debug")("dvori:plugin:json");

module.exports = () => ({
	onResponse: (res) => {
		try {
			res.data = JSON.parse(res.data);
			return res;
		} catch (e) {
			debug("JSON.parse failed");
			debug(e);
			// failed, just pass it on
			return res;
		}
	},
});
