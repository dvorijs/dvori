const { EventEmitter } = require("events");

class Queue extends EventEmitter {
	constructor() {
		super();
		this.isPaused = false;
		this.list = [];
	}
	hasNext() {
		return this.list.length > 0;
	}
	isEmpty() {
		return this.list.length === 0;
	}
	enqueue(obj) {
		this.list.push(obj);
		// this.process();
		// return this;
	}
	dequeue() {
		return this.list.shift();
	}
	async process() {
		if (this.isPaused) {
			return;
		}
		if (this.isEmpty()) {
			this.emit("complete", {});
			return;
		}
		try {
			while (this.hasNext() && !this.isPaused) {
				let response = await this.dequeue();
				this.emit("response", response);
			}
		} catch (e) {
			this.emit("error", e);
		}
	}
	pause() {
		console.log("this");
		console.log(this);
		console.log("emitted pause");
		this.isPaused = true;
		this.emit("paused");
	}
	resume() {
		if (!this.isPaused) {
			return;
		}
		this.isPaused = false;
		this.process();
	}
	clear() {
		for (obj of this.list) {
			obj.cancel();
		}
		return this;
	}
}

module.exports = () => new Queue();
