/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */
import {Linear as EasingLinear} from "./easing/Linear";
import {Linear as InterpolationLinear} from "./interpolation/Linear";
import {now} from "./polyfill";

let _nextId = 0;
const nextId = () => {
    return _nextId++;
};

export class Group {
    _tweens = {};
    _tweensAddedDuringUpdate = {};

    getAll() {
        return Object.keys(this._tweens).map(tweenId => this._tweens[tweenId]);
    }

    removeAll() {
        this._tweens = {};
    }

    removeOf(object) {
        Object.values(this._tweens).forEach(tween => {
            if (tween.getObject() === object) {
                this.remove(tween);
            }
        });
    }

    add(tween) {
        const id = tween.getId();
        this._tweens[id] = tween;
        this._tweensAddedDuringUpdate[id] = tween;
    }

    remove(tween) {
        const id = tween.getId();
        delete this._tweens[id];
        delete this._tweensAddedDuringUpdate[id];
    }

    has() {
        return Object.keys(this._tweens).length > 0 || Object.keys(this._tweensAddedDuringUpdate).length > 0;
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
    _easingFunction = EasingLinear.None;
    _interpolationFunction = InterpolationLinear;
    _chainedTweens = [];
    _onStartCallback = null;
    _onStartCallbackFired = false;
    _onUpdateCallback = null;
    _onRepeatCallback = null;
    _onCompleteCallback = null;
    _onStopCallback = null;
    _id = nextId();

    static removeOf(object) {
        defaultGroup.removeOf(object);
    }

    static updateAll(time, preserve) {
        defaultGroup.update(time, preserve);
    }

    /**
     * @param object {Object}
     * @param group {Group}
     */
    constructor(object, group = null) {
        this._object = object;
        this._group = group || defaultGroup;
    }

    /**
     * @return {Object}
     */
    getObject() {
        return this._object;
    }

    /**
     * @return {number}
     */
    getId() {
        return this._id;
    }

    /**
     * @return {boolean}
     */
    isPlaying() {
        return this._isPlaying;
    }

    /**
     * @return {boolean}
     */
    isPaused() {
        return this._isPaused;
    }

    /**
     * @param properties {Object}
     * @return {Tween}
     */
    from(properties) {
        for (let property in properties) {

            if (this._object[property] === undefined) {
                continue;
            }

            if (typeof (this._valuesStart[property]) === 'undefined') {
                this._valuesStart[property] = properties[property];
            }
        }

        return this;
    }

    /**
     * @param properties {Object}
     * @param duration {number}
     * @return {Tween}
     */
    to(properties, duration) {
        this._valuesEnd = Object.assign({}, properties);

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
    start(time) {
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
    stop() {
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
    end() {
        this.update(Infinity);
        return this;
    }

    /**
     * @param time {number}
     * @return {Tween}
     */
    pause(time) {
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
    resume(time) {
        if (!this._isPaused || !this._isPlaying) {
            return this;
        }

        this._isPaused = false;
        this._startTime += (time === undefined ? now() : time) - this._pauseStart;
        this._pauseStart = 0;
        this._group.add(this);

        return this;
    }

    /**
     * @return {Tween}
     */
    stopChainedTweens() {
        for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
            this._chainedTweens[i].stop();
        }
        return this;
    }

    /**
     * @param group {Group}
     * @return {Tween}
     */
    group(group) {
        this._group = group;
        return this;
    }

    /**
     * @param amount {number}
     * @return {Tween}
     */
    delay(amount) {
        this._delayTime = amount;
        return this;
    }

    /**
     * @param times {number}
     * @return {Tween}
     */
    repeat(times) {
        this._repeat = times;
        return this;
    }

    /**
     * @param amount {number}
     * @return {Tween}
     */
    repeatDelay(amount) {
        this._repeatDelayTime = amount;
        return this;
    }

    /**
     * @param yoyo {boolean}
     * @return {Tween}
     */
    yoyo(yoyo) {
        this._yoyo = yoyo;
        return this;
    }

    /**
     * @param easingFunction {function(k:number)}
     * @return {Tween}
     */
    easing(easingFunction) {
        this._easingFunction = easingFunction;
        return this;
    }

    /**
     * @param interpolationFunction {function(v:number, k:number)}
     * @return {Tween}
     */
    interpolation(interpolationFunction) {
        this._interpolationFunction = interpolationFunction;
        return this;
    }

    /**
     * @return {Tween}
     */
    chain() {
        this._chainedTweens = arguments;
        return this;
    }

    /**
     * @param callback {function(object:Object)}
     * @return {Tween}
     */
    onStart(callback) {
        this._onStartCallback = callback;
        return this;
    }

    /**
     * @param callback {function(object:Object, elapsed:number)}
     * @return {Tween}
     */
    onUpdate(callback) {
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
    onComplete(callback) {
        this._onCompleteCallback = callback;
        return this;
    }

    /**
     * @param callback {function(object:Object)}
     * @return {Tween}
     */
    onStop(callback) {
        this._onStopCallback = callback;
        return this;
    }

    /**
     * @param time {number}
     * @return {boolean}
     */
    update(time) {
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
