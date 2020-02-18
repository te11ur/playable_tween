export const Quintic = {
    In: k => k * k * k * k * k,
    Out: k => --k * k * k * k * k + 1,
    InOut: k => (k *= 2) < 1 ? 0.5 * k * k * k * k * k : 0.5 * ((k -= 2) * k * k * k * k + 2)
};