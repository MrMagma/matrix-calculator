export default function gcd(a, b) {
    if (a === 0) return b;
    if (b === 0) return a;
    if (a === b) return a;
    let d = 0;

    while (a % 2 === 0 && b % 2 === 0) {
        a /= 2;
        b /= 2;
        ++d;
    }

    while (a !== b) {
        if (a % 2 === 0) a /= 2;
        else if (b % 2 === 0) b /= 2;
        else if (a > b) a = (a - b) / 2;
        else if (b > a) b = (b - a) / 2;
    }

    return a << d;
}