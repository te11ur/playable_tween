import {Utils} from "./Utils";

export const Linear = (v, k) => {
    const m = v.length - 1;
    const f = m * k;
    const i = Math.floor(f);
    const fn = Utils.Linear;

    if (k < 0) {
        return fn(v[0], v[1], f);
    }

    if (k > 1) {
        return fn(v[m], v[m - 1], m - f);
    }

    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
};