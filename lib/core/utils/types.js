/*
	Type Checks
*/
const isAsyncFunc = f => f.constructor.name === "AsyncFunction";
const isPromise = o => o instanceof Promise;
const isBuffer = b => Buffer.isBuffer(b);
const isStream = s => isObject(s) && isFunction(s.pipe);
const isString = str => typeof str === "string" || str instanceof String;
const isArray = val => Array.isArray(val);

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = val => Object.prototype.toString.call(val) === "[object ArrayBuffer]";

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
const isArrayBufferView = val => {
	var result;
	if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
		result = ArrayBuffer.isView(val);
	} else {
		result = val && val.buffer && val.buffer instanceof ArrayBuffer;
	}
	return result;
};

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = val => {
	return typeof FormData !== "undefined" && val instanceof FormData;
};

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = val => val !== null && typeof val === "object";

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = val => Object.prototype.toString.call(val) === "[object Date]";

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = val => Object.prototype.toString.call(val) === "[object File]";
/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = val => Object.prototype.toString.call(val) === "[object Blob]";

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = val => Object.prototype.toString.call(val) === "[object Function]";

/**
 * Determine if a value is undefined
 *
 * @param {Any} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = val => typeof val === "undefined";

/**
 * Determine if a value is String and has a length > 0
 *
 * @param {String} val The value to test
 * @returns {boolean} True if the value is a non empty String, otherwise false
 */
const isNonEmptyString = val => isString(val) && val.trim().length > 0;

/**
 * check if a given value is a javascript primitive
 */
// function isPrimitive(value) {
// 	return value !== Object(value);
// }

/*
	Type Coercion
*/

const toNumber = (val, defaultVal = 0) => {
	if (!val) {
		return defaultVal;
	}

	if (typeof val == "number") {
		return val;
	}

	if (!isString(val)) {
		return val === 0 ? val : +val;
	}

	if (isNaN(val)) {
		return defaultVal;
	}
	throw new Error(`Can't coerce ${val} to a Number`);
};

const toString = (val, defaultVal = "") => {
	if (!val) {
		return defaultVal;
	}

	if (isString(val)) {
		return val;
	}

	try {
		return `${val}`;
	} catch (e) {
		throw new Error(`Can't coerce ${val} to a String`);
	}
};

const toBoolean = (val, defaultVal = false) => {
	if (!val) {
		return defaultVal;
	}

	if (isString(val)) {
		val = val.trim();
		if (val === "true") {
			return true;
		} else if (val === "false") {
			return true;
		} else if (val === "1") {
			return true;
		} else if (val === "0") {
			return false;
		}
	}

	if (val === 1) {
		return true;
	}

	if (val === 0) {
		return false;
	}

	try {
		return !!val;
	} catch (e) {
		throw new Error(`Can't coerce ${val} to a Boolean`);
	}
};

module.exports = {
	isAsyncFunc,
	isPromise,
	isBuffer,
	isArrayBuffer,
	isArrayBufferView,
	isFormData,
	isStream,
	isString,
	isNonEmptyString,
	isArray,
	isObject,
	isDate,
	isFile,
	isBlob,
	isFunction,
	isUndefined,
	toNumber,
	toString,
	toBoolean
};
