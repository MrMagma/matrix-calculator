/*
Copyright (C) 2018 Joshua Gammage

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

import React from "react";
import PropTypes from "prop-types";

import OP_ID from "../model/op-ids.json";

import matrices from "../matrices.js";

function getState({op, matrix1, matrix2}) {
    let m1r = matrices.getMatrixRows(matrix1),
        m1c = matrices.getMatrixColumns(matrix1),
        m2r = matrices.getMatrixRows(matrix2),
        m2c = matrices.getMatrixColumns(matrix2);

    switch (op) {
        case OP_ID.ADD:
        case OP_ID.SUBTRACT:
            if (m1r !== m2r && m1c !== m2c) {
                return {
                    allowOp: false,
                    hint: "The first and second matrix must have the same dimensions"
                };
            } else if (m1r !== m2r) {
                return {
                    allowOp: false,
                    hint: "Both matrices should have the same number of rows"
                };
            } else if (m1c !== m2c) {
                return {
                    allowOp: false,
                    hint: "Both matrices should have the same number of columns"
                };
            }
            break;
        case OP_ID.DIVIDE:
            if (m2r !== m2c) {
                return {
                    allowOp: false,
                    hint: "The second matrix must be square"
                };
            } else if (matrices.getMatrixDeterminant(matrix2).toFloat() === 0) {
                return {
                    allowOp: false,
                    hint: "The determinant of the second matrix must not be zero"
                };
            }
        case OP_ID.MULTIPLY:
            if (m1c !== m2r) {
                return {
                    allowOp: false,
                    hint: "The number of columns in the first matrix must equal the number of rows in the second matrix"
                };
            }
            break;
        case OP_ID.NOP:
            return {
                allowOp: false,
                hint: "NOP"
            };
    }

    return {
        allowOp: true,
        hint: ""
    };
}

export default class EqualButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let state = getState(this.props);

        return (
            <div>
                <button
                    className="btn btn-primary btn-block"
                    onClick={this.props.onClick}
                    disabled={!state.allowOp}
                >Equals</button>
                <div
                    className={`form-control ${state.allowOp ? "" : "is-invalid"}`}
                    hidden
                />
                <div
                    className="invalid-feedback"
                >{state.hint}</div>
            </div>
        );
    }
}

EqualButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    matrix1: PropTypes.string.isRequired,
    matrix2: PropTypes.string.isRequired,
    op: PropTypes.string.isRequired
};