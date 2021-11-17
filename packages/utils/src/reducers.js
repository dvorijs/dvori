/**
 * Get the property value of an object, given a dot separated path to the property name.
 *
 * @param {String} path The objects property name
 * @param {Object} object The object to traverse
 * @param {Any} defaultValue A default value to retrun if the path isn't valid
 * @returns {Any} The property value
 */
const get = path => (object, defaultValue = undefined) => {
	let pathArray = path.split(".");
	let index = 0;
	const length = pathArray.length;

	while (object != null && index < length) {
		object = object[pathArray[index++]];
	}
	let result = index && index == length ? object : undefined;

	return result === undefined ? defaultValue : result;
};

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
const trim = str => str.replace(/^\s*/, "").replace(/\s*$/, "");

/**
 * Capitalize the beginning of a string
 *
 * @param {String} str The String to capitalize
 * @returns {String} The String capitalized
 */
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Creates a function like `round`.
 *
 * @private
 * @param {string} methodName The name of the `Math` method to use when rounding.
 * @returns {Function} Returns the new round function.
 */
const round = (number, precision = 2) => {
	const func = Math.round;
	precision = precision == null ? 0 : precision >= 0 ? Math.min(precision, 292) : Math.max(precision, -292);
	if (precision) {
		// Shift with exponential notation to avoid floating-point issues.
		// See [MDN](https://mdn.io/round#Examples) for more details.
		let pair = `${number}e`.split("e");
		const value = func(`${pair[0]}e${+pair[1] + precision}`);

		pair = `${value}e`.split("e");
		return +`${pair[0]}e${+pair[1] - precision}`;
	}
	return func(number);
};

module.exports = {
	get,
	trim,
	capitalize,
	round
};
