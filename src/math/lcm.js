import gcd from "./gcd.js";

export default function lcm(a, b) {
    return a * b / gcd(a, b);
}