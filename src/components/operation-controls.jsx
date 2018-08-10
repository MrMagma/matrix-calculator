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

import React from "react";
import PropTypes from "prop-types";

import events from "../events.js";
import EVENT_ID from "../model/event-ids.json";

import style from "../styles/operation-controls.css";

import OP_ID from "../model/op-ids.json";

export default class OperationControls extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            op: OP_ID.NOP
        };
    }
    render() {
        return (
            <div
                className={`btn-group ${this.props.className}`}
                role="group"
            >
                <button
                    className={`btn ${this.state.op === OP_ID.ADD ? "btn-primary" : `btn-outline-primary ${style["btn-outline-primary"]}`}`}
                    type="button"
                    onClick={this.changeOp.bind(this, OP_ID.ADD)}
                >Add</button>
                <button
                    className={`btn ${this.state.op === OP_ID.SUBTRACT ? "btn-primary" : `btn-outline-primary ${style["btn-outline-primary"]}`}`}
                    type="button"
                    onClick={this.changeOp.bind(this, OP_ID.SUBTRACT)}
                >Subtract</button>
                <button
                    className={`btn ${this.state.op === OP_ID.MULTIPLY ? "btn-primary" : `btn-outline-primary ${style["btn-outline-primary"]}`}`}
                    type="button"
                    onClick={this.changeOp.bind(this, OP_ID.MULTIPLY)}
                >Multiply</button>
                <button
                    className={`btn ${this.state.op === OP_ID.DIVIDE ? "btn-primary" : `btn-outline-primary ${style["btn-outline-primary"]}`}`}
                    type="button"
                    onClick={this.changeOp.bind(this, OP_ID.DIVIDE)}
                >Divide</button>
            </div>
        );
    }
    changeOp(op) {
        if (op === this.state.op) {
            op = OP_ID.NOP;
        }

        this.setState({op: op});
        events.emit(EVENT_ID.OPERATION_CHANGED, op);
    }
}

OperationControls.propTypes = {
    matrixID: PropTypes.string.isRequired,
    className: PropTypes.string
};