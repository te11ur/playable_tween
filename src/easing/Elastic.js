export const Elastic = {
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
};