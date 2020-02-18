import {Utils} from "./Utils";

export const Bezier = (v, k) => {
    const n = v.length - 1;
    const pw = Math.pow;
    const bn = Utils.Bernstein;
    let b = 0;

    for (let i = 0; i <= n; i++) {
        b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
    }

    return b;
};