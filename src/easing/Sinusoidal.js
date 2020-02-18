export const Sinusoidal = {
    In: k => 1 - Math.cos(k * Math.PI / 2),
    Out: k => Math.sin(k * Math.PI / 2),
    InOut: k => 0.5 * (1 - Math.cos(Math.PI * k))
};