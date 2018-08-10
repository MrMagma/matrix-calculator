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

import hash from "../util/hash.js";

import Rational from "./rational.js";

let memo = {};

function matrixToString(M) {
    return M.map(row => `[${row.join(",")}]`).join(",");
}

function determinant(M) {
    if (M.length === 0 || M.length !== M[0].length) return new Rational(null);
    let h = hash(matrixToString(M));
    if (memo[h]) return new Rational(memo[h]);
    if (M.length === 1) return memo[h] = new Rational(M[0][0]);
    if (M.length === 2) return memo[h] = Rational.subtract(Rational.multiply(M[0][0], M[1][1]), Rational.multiply(M[1][0], M[0][1]));
    if (M.length === 3) return memo[h] = Rational.subtract(
        Rational.add(
            Rational.multiply(M[0][0], M[1][1], M[2][2]),
            Rational.multiply(M[0][1], M[1][2], M[2][0]),
            Rational.multiply(M[1][0], M[2][1], M[0][2])
        ),
        Rational.add(
            Rational.multiply(M[0][2], M[1][1], M[2][0]),
            Rational.multiply(M[0][1], M[1][0], M[2][2]),
            Rational.multiply(M[0][0], M[1][2], M[2][1])
        )
    );

    let d = new Rational(0),
        n = M.length;

    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            d = Rational.add(d, Rational.multiply(
                new Rational(Math.pow(-1, n - 1 + j)),
                M[n - 1][j],
                determinant(M.filter((_, row) => row !== i).map(row => row.slice(0, -1)))
            ));
        }
    }

    return memo[h] = d;
}

export default class Matrix {
    constructor(m) {
        if (m.constructor === Matrix) m = m.array();
        this.values = m.map(row => row.map(v => new Rational(v)));
    }
    static add(A, B) {
        if (A.rows() !== B.rows() || A.columns() !== B.columns()) return;
        return new Matrix(A.values.map((row, i) => row.map((_, j) => Rational.add(A.value(i, j), B.value(i, j)))));
    }
    static divide(A, B) {
        if (A.rows() !== B.rows() || !A.square() || !B.square()) return;

        return Matrix.multiply(A, B.inverse());
    }
    static identity(n) {
        let M = [];

        for (let i = 0; i < n; ++i) {
            M.push([]);
            for (let j = 0; j < n; ++j) {
                M[i].push(i === j ? 1 : 0);
            }
        }

        return new Matrix(M);
    }
    static multiply(A, B) {
        if (A.columns() !== B.rows()) return;

        let P = [],
            Pij;
        let m = B.rows();

        for (let i = 0; i < A.rows(); ++i) {
            P[i] = [];
            for (let j = 0; j < B.columns(); ++j) {
                Pij = new Rational(0);
                for (let k = 0; k < m; ++k) {
                    Pij = Rational.add(Pij, Rational.multiply(A.value(i, k), B.value(k, j)));
                }
                P[i][j] = Pij;
            }
        }
        
        return new Matrix(P);
    }
    static scale(k, M) {
        k = new Rational(k);
        return new Matrix(M.values.map(row => row.map(v => Rational.multiply(k, v))));
    }
    static subtract(A, B) {
        if (A.rows() !== B.rows() || A.columns() !== B.columns()) return;
        return new Matrix(A.values.map((row, i) => row.map((_, j) => Rational.subtract(A.value(i, j), B.value(i, j)))));
    }
    static zeros(m, n) {
        let M = [];

        for (let i = 0; i < m; ++i) {
            M.push([]);
            for (let j = 0; j < n; ++j) {
                M[i].push(0);
            }
        }

        return new Matrix(M);
    }
    array() {
        return this.values;
    }
    columns() {
        return this.values[0].length;
    }
    determinant() {
        return determinant(this.values);
    }
    inverse() {
        if (!this.square() || !this.determinant()) return;

        let n = this.rows();
        let adj = new Array(n);
        let detA = this.determinant();

        for (let j = 0; j < n; ++j) {
            adj[j] = new Array(n);
            for (let i = 0; i < n; ++i) {
                adj[j][i] = Rational.multiply(
                    Rational.divide(new Rational(Math.pow(-1, i + j)), detA),
                    determinant(this.values.filter((_, r) => r !== i).map(column => column.filter((_, c) => c !== j)))
                );
            }
        }
        
        return new Matrix(adj);
    }
    rows() {
        return this.values.length;
    }
    square() {
        return this.values.length === this.values[0].length;
    }
    setColumns(c) {
        if (c > 0) {
            while (this.columns() < c) {
                for (let i = 0; i < this.rows(); ++i) {
                    this.values[i].push(new Rational(null));
                }
            }

            while (this.columns() > c) {
                for (let i = 0; i < this.rows(); ++i) {
                    this.values[i].pop();
                }
            }
        }
    }
    setRows(r) {
        if (r > 0) {
            while (this.rows() < r) {
                this.values.push(this.values[0].map(() => new Rational(null)));
            }

            while (this.rows() > r) {
                this.values.pop();
            }
        }
    }
    setValue(i, j, v) {
        this.values[i][j] = new Rational(v);
    }
    toString() {
        return matrixToString(this.values);
    }
    transpose() {
        let T = new Array(this.values[0].length);

        for (let j = 0; j < this.values[0].length; ++j) {
            T[j] = new Array(this.values.length);
            for (let i = 0; i < this.values.length; ++i) {
                T[j][i] = this.values[i][j];
            }
        }

        return T;
    }
    value(i, j) {
        return this.values[i][j];
    }
}