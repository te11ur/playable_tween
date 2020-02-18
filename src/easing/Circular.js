export const Circular = {
    In: k => 1 - Math.sqrt(1 - k * k),
    Out: k => Math.sqrt(1 - (--k * k)),
    InOut: k => {
        if ((k *= 2) < 1) {
            return -0.5 * (Math.sqrt(1 - k * k) - 1);
        }

        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }
};