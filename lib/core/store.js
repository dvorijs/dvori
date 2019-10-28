const debug = require("debug")("rad:store");

const createStore = (reducer, initialState = {}) => {
	const store = {};
	store.state = initialState;
	store.listeners = [];

	store.getState = () => store.state;

	store.subscribe = listener => {
		store.listeners.push(listener);
	};

	store.setState = action => {
		store.state = reducer(store.state, action);
		store.listeners.forEach(listener => listener());
	};

	return store;
};

module.exports = initialState => createStore(addHook, initialState);
