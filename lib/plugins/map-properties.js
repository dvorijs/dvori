const _ = require("lodash");
const moment = require("moment-timezone");
const { isNonEmptyString, isObject, isArray, toNumber, toString, toBoolean, get, trim } = require("../core/utils");

// const coerce = require("./coerce");

const ALLOWED_FUNCTIONS = ["number", "string", "date", "boolean"];

const matchFunc = (allowedFunctions, str) => {
	let pattern = `\^\(\(\?\:${allowedFunctions.join("|")}\)\\(\)`;
	let regex = new RegExp(pattern, "g");

	let matches = str.match(regex);

	if (matches) {
		return matches.map(f => f.replace("(", "")).pop();
	}
	return null;
};

const coerce = (funcArray, data) => {
	let [func, propertyPath, ...args] = funcArray;
	let orginalVal = get(propertyPath)(data);
	func = func.toLowerCase();
	switch (func) {
		case "number":
			let num = toNumber(orginalVal, args);
			return _.round(num, 2);
		case "string":
			return toString(orginalVal, args);
		case "boolean":
			return toBoolean(orginalVal, args);
		case "date":
			let [dateType, format] = args;
			if (dateType === "unix") {
				return moment.unix(orginalVal).toISOString();
			}
			if (dateType === "iso") {
				return moment(orginalVal).toISOString();
			}
			if (dateType === "utc") {
				if (format) {
					return moment.utc(orginalVal, format).toISOString();
				}
				return moment.utc(orginalVal).toISOString();
			}
			if (!format) {
				format = dateType;
			}
			return moment(orginalVal, format).toISOString();
			break;

		default:
			throw new Error(`${func} is not a valid coercion type`);
			break;
	}
};

const mapProperties = (instructions, obj) => {
	try {
		let out = {};
		for (let key in instructions) {
			let newPath = key;
			let originalPath = instructions[key];

			if (isNonEmptyString(originalPath)) {
				if (matchFunc(ALLOWED_FUNCTIONS, originalPath)) {
					// turns: number(path, default) to [number, path, default]
					let funcArray = originalPath
						.split(/[(),]/g)
						.filter(Boolean)
						.map(val => trim(val));
					let coerceVal = coerce(funcArray, obj);

					out[newPath] = coerceVal;
				} else {
					// TODO: needs to handle arrays
					if (originalPath.indexOf("[]") > -1) {
						// ????
					}
					out[newPath] = get(originalPath)(obj);
				}
			}
			// TODO: should handle more than objects
			else if (isArray(originalPath)) {
				originalPath.forEach(item => {
					if (isObject(item)) {
						return mapProperties(instructions, item);
					}
				});
			}
			// Keep traversing
			else if (isObject(originalPath)) {
				out[newPath] = mapProperties(originalPath, obj);
			} else {
				out[newPath] = "";
			}
		}

		return out;
	} catch (e) {
		throw e;
	}
};

module.exports = mapProperties;
