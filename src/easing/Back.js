export const Back = {
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
};