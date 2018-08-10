/*
Copyright 2018 Joshua Gammage

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import gcd from "./gcd.js";
import _lcm from "./lcm.js";

function lcm(N) {
    let n = _lcm(N[0], N[1]);

    for (let i = 2; i < N.length; ++i) {
        if (N[i] === 0) continue;
        n = _lcm(n, N[i]);
    }

    return n;
}

export default class Rational {
    constructor(n, d = 1) {
        if (n != null) {
            if (n.constructor === Rational) {
                d = n.d;
                n = n.n;
            }

            if (n === Math.round(n) && d === Math.round(d)) {
                let f = gcd(Math.abs(n), Math.abs(d));
                n /= f;
                d /= f;
            }
        }
        
        this._n = 1;
        this.n = 1;
        this.d = 1;

        this.numerator = n;
        this.denominator = d;
    }
    get numerator() {
        return this._n;
    }
    set numerator(n) {
        if (n != null) {
            return this._n = this.n = n;
        } else {
            this.n = 0;
            return this._n = null;
        }
    }
    get denominator() {
        return this.d;
    }
    set denominator(d) {
        if (d !== 0) {
            this.d = d;
        }
    }
    toString() {
        if (!this.isNull()) {
            let realVal = this.n / this.d;
            if (Math.round(realVal) === realVal) return realVal.toString();
        }
        
        return `${this.n}/${this.d}`;
    }
    toFloat() {
        if (this._n != null) {
            return this.n / this.d;
        } else {
            return null;
        }
    }
    isNull() {
        return this._n == null;
    }
    static add(...F) {
        let d = lcm(F.map(f => f.d));

        return new Rational(F.reduce((prev, curr) => curr.n * d / curr.d + prev, 0), d);
    }
    static subtract(a, b) {
        let d = lcm([a.d, b.d]);
        
        return new Rational(a.n * d / a.d - b.n * d / b.d, d);
    }
    static multiply(...F) {
        return new Rational(F.reduce((p, c) => p * c.n, 1), F.reduce((p, c) => p * c.d, 1));
    }
    static divide(a, b) {
        return new Rational(a.n * b.d, a.d * b.n);
    }
}