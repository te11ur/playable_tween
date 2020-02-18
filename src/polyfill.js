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
    now = () => new Date().getTime();
}
export {now};