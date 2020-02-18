export const Quartic = {
    In: k => k * k * k * k,
    Out: k => 1 - (--k * k * k * k),
    InOut: k => (k *= 2) < 1 ? 0.5 * k * k * k * k : -0.5 * ((k -= 2) * k * k * k - 2)
};