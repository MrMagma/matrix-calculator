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

import events from "../events.js";
import EVENT_ID from "../model/event-ids.json";

import matrices from "../matrices.js";
import Rational from "../math/rational.js";

import isNaN from "../util/is-nan.js";

import matrixCSS from "../styles/matrix.css";

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 12;

class DimensionControl extends React.Component {
    constructor(props) {
        super(props);

        this.validChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        this.state = {
            displayValue: props.value.toString(),
            value: props.value
        };
    }
    // Listen, I would use getDerivedStateFromProps like I'm supposed to, but it doesn't seem to be working for me
    // Maybe it's because I'm using preact, but I'm too lazy to find out
    // Also, I'm not adding 100kb to my app just so I can do this the "right" way
    componentWillReceiveProps(props) {
        if (props.value !== this.state.value) {
            this.setState({
                displayValue: props.value.toString(),
                value: props.value
            });
        }
    }
    render() {
        let hint = this.getHint();
        return (
            <div
                className={matrixCSS["dimension-control"]}
            >
                <label>{this.props.label || ""}</label>
                <div
                    className="input-group"
                >
                    <div
                        className="input-group-prepend"
                    >
                        <button
                            className="btn"
                            onClick={this.handleDecrement.bind(this)}
                        ><i className="fas fa-minus"></i></button>
                    </div>
                    <input
                        className="form-control"
                        type="text"
                        placeholder={this.state.value.toString()}
                        value={this.state.displayValue}
                        onChange={this.handleChange.bind(this)}
                    />
                    <div
                        className="input-group-append"
                    >
                        <button
                            className="btn"
                            onClick={this.handleIncrement.bind(this)}
                        ><i className="fas fa-plus"></i></button>
                    </div>
                    <div
                        className={`invalid-feedback ${hint.length ? "d-block" : "d-none"}`}
                    >
                        {hint}
                    </div>
                </div>
            </div>
        );
    }
    getHint() {
        let name = this.props.name ? this.props.name[0].toUpperCase() + this.props.name.substring(1) : "Value";
        
        if (parseInt(this.state.displayValue) !== parseFloat(this.state.displayValue)) {
            return "Non-integer values will be rounded down";
        } else if (parseFloat(this.state.displayValue) < (this.props.min || DEFAULT_MIN)) {
            return `${name} cannot be less than ${this.props.min || DEFAULT_MIN}`;
        } else if (parseFloat(this.state.displayValue) > (this.props.max || DEFAULT_MAX)) {
            return `${name} cannot be greater than ${this.props.max || DEFAULT_MAX}`;
        } else {
            return "";
        }
    }
    setValue(v) {
        let ns = {
            displayValue: v
        };

        let nv = parseInt(v);

        if (v.length !== 0 && !isNaN(nv) &&
            nv <= (this.props.max || DEFAULT_MAX) &&
            nv >= (this.props.min || DEFAULT_MIN)) {
            ns.value = nv;
            this.props.onChange(nv);
        }
        
        this.setState(ns);
    }
    handleChange(evt) {
        this.setValue(evt.target.value.split("").filter(c => this.validChars.indexOf(c) > -1).join(""));
    }
    handleIncrement() {
        this.setValue(parseFloat(this.state.displayValue) + 1);
    }
    handleDecrement() {
        this.setValue(parseFloat(this.state.displayValue) - 1);
    }
}

DimensionControl.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func.isRequired
};

class MatrixInput extends React.PureComponent {
    constructor(props) {
        super(props);

        this.validChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "/"];

        this.state = {
            displayValue: props.value.n == null ? "" : props.value.toString(),
            value: props.value
        };
    }
    componentWillReceiveProps(props) {
        if (!Rational.equal(this.state.value, props.value)) {
            this.setState({
                displayValue: props.value.n == null ? "" : props.value.toString(),
                value: props.value
            });
        }
    }
    render() {
        return (
            <input
                className="form-control"
                type="text"
                onChange={this.handleChange.bind(this)}
                value={this.state.displayValue}
                placeholder="0"
            />
        );
    }
    handleChange(evt) {
        let etv = evt.target.value;
        if (etv !== this.state.displayValue) {
            etv = etv.split("").filter(c => this.validChars.indexOf(c) > -1).join("");

            let ns = {
                displayValue: etv
            };
            
            if (etv[0] !== "/" && etv[etv.length - 1] !== "/") {
                ns.value = Rational.parse(etv);
                this.props.onChange(evt.target.value.length > 0 ? evt.target.value : null);
            }

            this.setState(ns);
        }
    }
}

MatrixInput.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
};

export default class EditableMatrix extends React.Component {
    constructor(props) {
        super(props);

        events.on(EVENT_ID.MATRIX_CHANGE, (id) => {
            if (id === this.props.matrixID) {
                this.forceUpdate();
            }
        });
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className={`col-12 pt-3 ${matrixCSS["matrix-container"]}`}>
                        <table
                            className={`table table-borderless ${matrixCSS["matrix"]} ${matrixCSS["editable-matrix"]}`}
                        >
                            <tbody>
                                {matrices.getMatrix(this.props.matrixID).array().map((row, x) => <tr key={x}>
                                    {row.map((cell, y) => <td key={y}>
                                        <MatrixInput
                                            onChange={this.handleCellChange.bind(this, x, y)}
                                            value={cell}
                                        />
                                    </td>)}
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <DimensionControl
                            onChange={this.handleWidthChange.bind(this)}
                            label="Rows"
                            name="rows"
                            value={matrices.getMatrixRows(this.props.matrixID)}
                        />
                    </div>
                    <div className="col-6">
                        <DimensionControl
                            onChange={this.handleHeightChange.bind(this)}
                            label="Columns"
                            name="columns"
                            value={matrices.getMatrixColumns(this.props.matrixID)}
                        />
                    </div>
                </div>
            </div>
        );
    }
    handleWidthChange(w) {
        matrices.setMatrixRows(this.props.matrixID, w);
    }
    handleHeightChange(h) {
        matrices.setMatrixColumns(this.props.matrixID, h);
    }
    handleCellChange(x, y, v) {
        matrices.setMatrixValue(this.props.matrixID, x, y, v);
    }
}

EditableMatrix.propTypes = {
    matrixID: PropTypes.string.isRequired
};