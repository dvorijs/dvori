const path = require("path");

module.exports = {
	// testMatch: ["packages/**/tests/**/*.js"],
	// testPathIgnorePatterns: ["/tests/helpers/", "/tests/__mocks__/"],
	moduleNameMapper: {
		"^@dvori/(.*)": path.resolve(__dirname, "./packages/$1"),
	},
};
