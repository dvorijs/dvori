const debug = require("debug")("rad:core:compose-plugins");
const { pipeSync } = require("./utils");

module.exports = (...plugins) => {
	let hooks = {
		onRequest: [],
		onResponse: [],
		onError: []
	};

	let pluginHooks = [...plugins].reduce((acc, plugin) => {
		for (let name in plugin) {
			if (name in hooks) {
				acc[name].push(plugin[name]);
			} else {
				console.log(`Unknown plugin hook "${name}".`);
			}
		}
		return acc;
	}, hooks);

	for (const hook in pluginHooks) {
		if (Array.isArray(pluginHooks[hook])) {
			pluginHooks[hook] = pipeSync(...pluginHooks[hook]);
		}
	}

	return pluginHooks;
};
