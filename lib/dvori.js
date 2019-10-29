"use strict";
const debug = require("debug")("dvori:core");

const { pipe } = require("./core/utils");

const createClient = require("./core/create-client");
const composePlugins = require("./core/compose-plugins");

const composeMiddleware = (...middlewares) => {
	return pipe(...middlewares);
};

module.exports = {
	createClient,
	composeMiddleware,
	composePlugins
};
