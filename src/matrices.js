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

import events from "./events.js";
import EVENT_ID from "./model/event-ids.json";
import uid from "./util/uid.js";

import Matrix from "./math/matrix.js";

let matrices = {};

export default {
    setMatrix(id, m) {
        matrices[id] = new Matrix(m);
        
        events.emit(EVENT_ID.MATRIX_CHANGE, id);
    },
    setMatrixRows(id, r) {
        if (r !== matrices[id].rows()) {
            matrices[id].setRows(r);
            events.emit(EVENT_ID.MATRIX_CHANGE, id);
        }
    },
    setMatrixColumns(id, c) {
        if (c !== matrices[id].columns()) {
            matrices[id].setColumns(c);
            events.emit(EVENT_ID.MATRIX_CHANGE, id);
        }
    },
    setMatrixValue(id, r, c, v) {
        matrices[id].setValue(r, c, v);

        events.emit(EVENT_ID.MATRIX_CHANGE, id);
    },
    getMatrixRows(id) {
        return matrices[id].rows();
    },
    getMatrixColumns(id) {
        return matrices[id].columns();
    },
    getMatrixValue(id, r, c) {
        return matrices[id].value(r, c);
    },
    getMatrix(id) {
        return matrices[id];
    },
    addMatrix(m) {
        let id = uid();

        matrices[id] = new Matrix(m);

        return id;
    },
    getMatrixDeterminant(id) {
        return matrices[id].determinant();
    },
    invertMatrix(id) {
        matrices[id] = matrices[id].inverse();

        events.emit(EVENT_ID.MATRIX_CHANGE, id);
    },
    scaleMatrix(id, n) {
        matrices[id] = Matrix.scale(n, matrices[id]);

        events.emit(EVENT_ID.MATRIX_CHANGE, id);
    },
    transposeMatrix(id) {
        matrices[id] = matrices[id].transpose();

        events.emit(EVENT_ID.MATRIX_CHANGE, id);
    },
    identity(n) {
        return Matrix.identity(n);
    },
    empty(m, n) {
        return Matrix.zeros(m, n);
    },
    add(id1, id2) {
        return Matrix.add(matrices[id1], matrices[id2]);
    },
    subtract(id1, id2) {
        return Matrix.subtract(matrices[id1], matrices[id2]);
    },
    multiply(id1, id2) {
        return Matrix.multiply(matrices[id1], matrices[id2]);
    },
    divide(id1, id2) {
        return Matrix.divide(matrices[id1], matrices[id2]);
    }
};