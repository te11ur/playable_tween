export const  Utils = {
    Linear: (p0, p1, t) => (p1 - p0) * t + p0,
    Bernstein: (n, i) => {
        const fc = Utils.Factorial;
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
};