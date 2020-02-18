export const Quadratic = {
    In: k => k * k,
    Out: k => k * (2 - k),
    InOut: k => (k *= 2) < 1 ? 0.5 * k * k : -0.5 * (--k * (k - 2) - 1)
};