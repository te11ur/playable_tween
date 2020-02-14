/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Include a performance.now polyfill.
let now;
if (typeof (self) === 'undefined' && typeof (process) !== 'undefined' && process.hrtime) {
	// In node.js, use process.hrtime.
	now = () => {
		const time = process.hrtime();
		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
} else if (typeof (self) !== 'undefined' &&
	self.performance !== undefined &&
	self.performance.now !== undefined) {
	// In a browser, use self.performance.now if it is available.
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	now = self.performance.now.bind(self.performance);
} else if (Date.now !== undefined) {
// Use Date.now if it is available.
	now = Date.now;
} else {
// Otherwise, use 'new Date().getTime()'.
	now = () => {
		return new Date().getTime();
	};
}

let _nextId = 0;
const nextId = () => {
	return _nextId++;
};

export const Easing = {
	Linear: {
		None: k => k
	},

	Quadratic: {
		In: k =>  k * k,
		Out: k =>k * (2 - k),
		InOut: k => (k *= 2) < 1 ? 0.5 * k * k : -0.5 * (--k * (k - 2) - 1)
	},

	Cubic: {
		In: k => k * k * k,
		Out: k => --k * k * k + 1,
		InOut: k => (k *= 2) < 1 ? 0.5 * k * k * k : 0.5 * ((k -= 2) * k * k + 2)
	},

	Quartic: {
		In: k => k * k * k * k,
		Out: k => 1 - (--k * k * k * k),
		InOut: k => (k *= 2) < 1 ? 0.5 * k * k * k * k : -0.5 * ((k -= 2) * k * k * k - 2)
	},

	Quintic: {
		In: k => k * k * k * k * k,
		Out: k => --k * k * k * k * k + 1,
		InOut: k => (k *= 2) < 1 ? 0.5 * k * k * k * k * k :  0.5 * ((k -= 2) * k * k * k * k + 2)
	},

	Sinusoidal: {
		In: k =>  1 - Math.cos(k * Math.PI / 2),
		Out: k =>  Math.sin(k * Math.PI / 2),
		InOut: k => 0.5 * (1 - Math.cos(Math.PI * k))
	},

	Exponential: {
		In: k => k === 0 ? 0 : Math.pow(1024, k - 1),
		Out: k => k === 1 ? 1 : 1 - Math.pow(2, -10 * k),

		InOut: k =>  {
			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		}
	},

	Circular: {
		In: k =>1 - Math.sqrt(1 - k * k),
		Out: k =>Math.sqrt(1 - (--k * k)),
		InOut: k => {
			if ((k *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		}
	},

	Elastic: {
		In: k => {
			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
		},
		Out: k => {
			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
		},
		InOut: k => {
			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
		}
	},
	Back: {
		In: k => {
			const s = 1.70158;
			return k * k * ((s + 1) * k - s);
		},
		Out: k => {
			const s = 1.70158;
			return --k * k * ((s + 1) * k + s) + 1;
		},
		InOut: k => {
			const s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		}
	},

	Bounce: {
		In: k=> {
			return 1 - Easing.Bounce.Out(1 - k);
		},
		Out: k=> {
			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}
		},
		InOut: k => {
			if (k < 0.5) {
				return Easing.Bounce.In(k * 2) * 0.5;
			}

			return Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
		}
	}

};

export const Interpolation = {
	Linear: (v, k) => {
		const m = v.length - 1;
		const f = m * k;
		const i = Math.floor(f);
		const fn = Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
	},

	Bezier: (v, k) => {
		const n = v.length - 1;
		const pw = Math.pow;
		const bn = Interpolation.Utils.Bernstein;
		let b = 0;

		for (let i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;
	},

	CatmullRom: (v, k) => {
		const m = v.length - 1;
		const fn = Interpolation.Utils.CatmullRom;
		let f = m * k;
		let i = Math.floor(f);

		if (v[0] === v[m]) {
			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {
			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
		}
	},

	Utils: {
		Linear: (p0, p1, t) => (p1 - p0) * t + p0,
		Bernstein: (n, i) => {
			const fc = Interpolation.Utils.Factorial;
			return fc(n) / fc(i) / fc(n - i);
		},
		Factorial: (function () {
			const a = [1];
			return n => {
				let s = 1;

				if (a[n]) {
					return a[n];
				}

				for (let i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;
			};
		})(),
		CatmullRom: (p0, p1, p2, p3, t) => {
			const v0 = (p2 - p0) * 0.5;
			const v1 = (p3 - p1) * 0.5;
			const t2 = t * t;
			const t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
		}
	}
};

export class Group {
    _tweens = {};
    _tweensAddedDuringUpdate = {};

    getAll() {
        return Object.keys(this._tweens).map(tweenId => {
            return this._tweens[tweenId];
        });
    }

    removeAll() {
        this._tweens = {};
    }

    add(tween) {
        this._tweens[tween.getId()] = tween;
        this._tweensAddedDuringUpdate[tween.getId()] = tween;
    }

    remove(tween) {
        delete this._tweens[tween.getId()];
        delete this._tweensAddedDuringUpdate[tween.getId()];
    }

    update(time, preserve) {
        let tweenIds = Object.keys(this._tweens);
        if (tweenIds.length === 0) {
            return false;
        }

        time = time !== undefined ? time : now();

        // Tweens are updated in "batches". If you add a new tween during an
        // update, then the new tween will be updated in the next batch.
        // If you remove a tween during an update, it may or may not be updated.
        // However, if the removed tween was added during the current batch,
        // then it will not be updated.
        while (tweenIds.length > 0) {
            this._tweensAddedDuringUpdate = {};

            for (let i = 0; i < tweenIds.length; i++) {
                const tween = this._tweens[tweenIds[i]];
                if (tween && tween.update(time) === false) {
                    tween._isPlaying = false;
                    if (!preserve) {
                        delete this._tweens[tweenIds[i]];
                    }
                }
            }

            tweenIds = Object.keys(this._tweensAddedDuringUpdate);
        }

        return true;
    }
}

const defaultGroup = new Group();

export class Tween {
	_isPaused = false;
	_pauseStart = null;
	_valuesStart = {};
	_valuesEnd = {};
	_valuesStartRepeat = {};
	_duration = 1000;
	_repeat = 0;
	_repeatDelayTime = undefined;
	_yoyo = false;
	_isPlaying = false;
	_reversed = false;
	_delayTime = 0;
	_startTime = null;
	_easingFunction = Easing.Linear.None;
	_interpolationFunction = Interpolation.Linear;
	_chainedTweens = [];
	_onStartCallback = null;
	_onStartCallbackFired = false;
	_onUpdateCallback = null;
	_onRepeatCallback = null;
	_onCompleteCallback = null;
	_onStopCallback = null;
	_id = nextId();

	constructor(object, group) {
		this._object = object;
		this._group = group || defaultGroup;
	}

	/**
	 * @return {number}
	 */
	getId () {
		return this._id;
	}

	/**
	 * @return {boolean}
	 */
	isPlaying () {
		return this._isPlaying;
	}

	/**
	 * @return {boolean}
	 */
	isPaused () {
		return this._isPaused;
	}

	/**
	 * @param properties {Object}
	 * @param duration {number}
	 * @return {Tween}
	 */
	to (properties, duration) {
		this._valuesEnd = Object.create(properties);

		if (duration !== undefined) {
			this._duration = duration;
		}

		return this;
	}

	/**
	 * @param d {number}
	 * @return {Tween}
	 */
	duration(d) {
		this._duration = d;
		return this;
	}

	/**
	 * @param time {string|number}
	 * @return {Tween}
	 */
	start (time) {
		this._group.add(this);
		this._isPlaying = true;
		this._isPaused = false;
		this._onStartCallbackFired = false;
		this._startTime = time !== undefined ? typeof time === 'string' ? now() + parseFloat(time) : time : now();
		this._startTime += this._delayTime;

		for (let property in this._valuesEnd) {
			// Check if an Array was provided as property value
			if (this._valuesEnd[property] instanceof Array) {
				if (this._valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);
			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (this._object[property] === undefined) {
				continue;
			}

			// Save the starting value, but only once.
			if (typeof (this._valuesStart[property]) === 'undefined') {
				this._valuesStart[property] = this._object[property];
			}

			if ((this._valuesStart[property] instanceof Array) === false) {
				this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
		}

		return this;
	}

	/**
	 * @return {Tween}
	 */
	stop () {
		if (!this._isPlaying) {
			return this;
		}

		this._group.remove(this);
		this._isPlaying = false;
		this._isPaused = false;

		if (this._onStopCallback !== null) {
			this._onStopCallback(this._object);
		}

		this.stopChainedTweens();
		return this;
	}

	/**
	 * @return {Tween}
	 */
	end () {
		this.update(Infinity);
		return this;
	}

	/**
	 * @param time {number}
	 * @return {Tween}
	 */
	pause (time) {
		if (this._isPaused || !this._isPlaying) {
			return this;
		}

		this._isPaused = true;
		this._pauseStart = time === undefined ? now() : time;
		this._group.remove(this);

		return this;
	}

	/**
	 * @param time {number}
	 * @return {Tween}
	 */
	resume (time) {
		if (!this._isPaused || !this._isPlaying) {
			return this;
		}

		this._isPaused = false;
		this._startTime += (time === undefined ? now() : time)- this._pauseStart;
		this._pauseStart = 0;
		this._group.add(this);

		return this;
	}

	/**
	 * @return {Tween}
	 */
	stopChainedTweens () {
		for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
			this._chainedTweens[i].stop();
		}
		return this;
	}

	/**
	 * @param group {Group}
	 * @return {Tween}
	 */
	group (group) {
		this._group = group;
		return this;
	}

	/**
	 * @param amount {number}
	 * @return {Tween}
	 */
	delay (amount) {
		this._delayTime = amount;
		return this;
	}

	/**
	 * @param times {number}
	 * @return {Tween}
	 */
	repeat (times) {
		this._repeat = times;
		return this;
	}

	/**
	 * @param amount {number}
	 * @return {Tween}
	 */
	repeatDelay (amount) {
		this._repeatDelayTime = amount;
		return this;
	}

	/**
	 * @param yoyo {boolean}
	 * @return {Tween}
	 */
	yoyo (yoyo) {
		this._yoyo = yoyo;
		return this;
	}

	/**
	 * @param easingFunction {function(k:number)}
	 * @return {Tween}
	 */
	easing (easingFunction) {
		this._easingFunction = easingFunction;
		return this;
	}

	/**
	 * @param interpolationFunction {function(v:number, k:number)}
	 * @return {Tween}
	 */
	interpolation (interpolationFunction) {
		this._interpolationFunction = interpolationFunction;
		return this;
	}

	/**
	 * @return {Tween}
	 */
	chain () {
		this._chainedTweens = arguments;
		return this;
	}

	/**
	 * @param callback {function(object:Object)}
	 * @return {Tween}
	 */
	onStart (callback) {
		this._onStartCallback = callback;
		return this;
	}

	/**
	 * @param callback {function(object:Object, elapsed:number)}
	 * @return {Tween}
	 */
	onUpdate (callback) {
		this._onUpdateCallback = callback;
		return this;
	}

	/**
	 * @param callback {function(object:Object)}
	 * @return {Tween}
	 */
	onRepeat(callback) {
		this._onRepeatCallback = callback;
		return this;
	}

	/**
	 * @param callback {function(object:Object)}
	 * @return {Tween}
	 */
	onComplete (callback) {
		this._onCompleteCallback = callback;
		return this;
	}

	/**
	 * @param callback {function(object:Object)}
	 * @return {Tween}
	 */
	onStop (callback) {
		this._onStopCallback = callback;
		return this;
	}

	/**
	 * @param time {number}
	 * @return {boolean}
	 */
	update (time) {
		if (time < this._startTime) {
			return true;
		}

		if (this._onStartCallbackFired === false) {
			if (this._onStartCallback !== null) {
				this._onStartCallback(this._object);
			}

			this._onStartCallbackFired = true;
		}

		let elapsed = (time - this._startTime) / this._duration;
		elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;
		const value = this._easingFunction(elapsed);

		for (let property in this._valuesEnd) {
			// Don't update properties that do not exist in the source object
			if (this._valuesStart[property] === undefined) {
				continue;
			}

			const start = this._valuesStart[property] || 0;
			let end = this._valuesEnd[property];

			if (end instanceof Array) {
				this._object[property] = this._interpolationFunction(end, value);
			} else {
				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {
					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					this._object[property] = start + (end - start) * value;
				}
			}
		}

		if (this._onUpdateCallback !== null) {
			this._onUpdateCallback(this._object, elapsed);
		}

		if (elapsed === 1) {
			if (this._repeat > 0) {
				if (isFinite(this._repeat)) {
					this._repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (let property in this._valuesStartRepeat) {
					if (typeof (this._valuesEnd[property]) === 'string') {
						this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
					}

					if (this._yoyo) {
						let tmp = this._valuesStartRepeat[property];
						this._valuesStartRepeat[property] = this._valuesEnd[property];
						this._valuesEnd[property] = tmp;
					}

					this._valuesStart[property] = this._valuesStartRepeat[property];

				}

				if (this._yoyo) {
					this._reversed = !this._reversed;
				}

				if (this._repeatDelayTime !== undefined) {
					this._startTime = time + this._repeatDelayTime;
				} else {
					this._startTime = time + this._delayTime;
				}

				if (this._onRepeatCallback !== null) {
					this._onRepeatCallback(this._object);
				}

				return true;
			} else {
				if (this._onCompleteCallback !== null) {
					this._onCompleteCallback(this._object);
				}

				for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					this._chainedTweens[i].start(this._startTime + this._duration);
				}

				return false;
			}
		}

		return true;
	}
}
