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

import isNaN from "../util/is-nan.js";

import matrixCSS from "../styles/matrix.css";

export default class StaticMatrix extends React.Component {
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
                    <div className={`col pt-3 ${matrixCSS["matrix-container"]}`}>
                        <table
                            className={`table table-borderless ${matrixCSS["matrix"]}`}
                        >
                            <tbody>
                                {matrices.getMatrix(this.props.matrixID).array().map((row, x) => <tr key={x}>
                                    {row.map((cell, y) => <td
                                        className="text-center"
                                        key={y}
                                    >{isNaN(cell.toFloat()) ? 0 : cell.toString()}</td>)}
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

StaticMatrix.propTypes = {
    matrixID: PropTypes.string.isRequired
};