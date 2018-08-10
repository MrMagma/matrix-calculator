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

export default class MatrixControls extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            scaleTxt: "1",
            scale: 1
        };

        events.on(EVENT_ID.MATRIX_CHANGE, (id) => {
            if (id === this.props.matrixID) {
                this.forceUpdate();
            }
        });
    }
    render() {
        return (
            <div
                className="input-group"
            >
                <div
                    className="input-group-prepend"
                >
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={matrices.transposeMatrix.bind(null, this.props.matrixID)}
                    >Transpose</button>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={matrices.invertMatrix.bind(null, this.props.matrixID)}
                        disabled={matrices.getMatrixRows(this.props.matrixID) !== matrices.getMatrixColumns(this.props.matrixID) ||
                            !matrices.getMatrixDeterminant(this.props.matrixID).toFloat()}
                    >Invert</button>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={matrices.scaleMatrix.bind(null, this.props.matrixID, this.state.scale)}
                    >Scale by</button>
                </div>
                <input
                    className="form-control"
                    type="number"
                    value={this.state.scaleTxt}
                    placeholder="1"
                    onChange={this.handleScaleChange.bind(this)}
                />
            </div>
        );
    }
    handleScaleChange(evt) {
        this.setState({
            scaleTxt: evt.target.value,
            scale: evt.target.value.length > 0 ? parseFloat(evt.target.value) : 1
        });
    }
}

MatrixControls.propTypes = {
    matrixID: PropTypes.string.isRequired
};