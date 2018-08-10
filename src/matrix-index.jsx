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
import ReactDOM from "react-dom";

import EditableMatrix from "./components/editable-matrix.jsx";
import MatrixControls from "./components/matrix-controls.jsx";
import OperationControls from "./components/operation-controls.jsx";
import MatrixData from "./components/matrix-data.jsx";
import StaticMatrix from "./components/static-matrix.jsx";
import EqualButton from "./components/equal-button.jsx";
import PageGrouping from "./components/page-grouping.jsx";
import Page from "./components/page.jsx";
import matrices from "./matrices.js";

import events from "./events.js";
import EVENT_ID from "./model/event-ids.json";

import OP_ID from "./model/op-ids.json";

// I don't know why this doesn't work, but it doesn't and I'm too lazy to find out why
// screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || ScreenOrientation.lock || (() => {});
// screen.lockOrientationUniversal("portrait-primary");

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            matrix1: matrices.addMatrix([
                [1, 0],
                [0, 1]
            ]),
            matrix2: matrices.addMatrix([
                [0, 0],
                [0, 0]
            ]),
            matrix3: matrices.addMatrix([
                [0, 0],
                [0, 0]
            ]),
            showResult: false,
            op: OP_ID.NOP
        };

        events.on(EVENT_ID.OPERATION_CHANGED, this.handleOpChange.bind(this));
        events.on(EVENT_ID.MATRIX_CHANGE, this.handleMatrixChange.bind(this));
    }
    render() {
        return (
            <Page
                className="container"
            >
                <PageGrouping>
                    <div
                        className="row mb-3"
                    >
                        <div
                            className="col"
                        >
                            <EditableMatrix
                                matrixID={this.state.matrix1}
                            />
                        </div>
                    </div>
                    <div
                        className="row"
                    >
                        <div
                            className="col"
                        >
                            <MatrixData
                                matrixID={this.state.matrix1}
                            />
                        </div>
                    </div>
                    <div
                        className="row"
                    >
                        <div
                            className="col-sm-12 col-md-6 mb-3"
                        >
                            <MatrixControls
                                matrixID={this.state.matrix1}
                            />
                        </div>
                        <div
                            className="col-sm-12 col-md-6 mb-3"
                        >
                            <OperationControls
                                matrixID={this.state.matrix1}
                                className="float-md-right"
                            />
                        </div>
                    </div>
                </PageGrouping>
                <PageGrouping
                    hidden={this.state.op === OP_ID.NOP}
                >
                    <div
                        className="row mb-3 mt-3"
                    >
                        <div
                            className="col"
                        >
                            <EditableMatrix
                                matrixID={this.state.matrix2}
                            />
                        </div>
                    </div>
                    <div
                        className="row"
                    >
                        <div
                            className="col"
                        >
                            <MatrixData
                                matrixID={this.state.matrix2}
                            />
                        </div>
                    </div>
                    <div
                        className="row mb-3"
                    >
                        <div
                            className="col"
                        >
                            <EqualButton
                                matrix1={this.state.matrix1}
                                matrix2={this.state.matrix2}
                                op={this.state.op}
                                onClick={this.showResult.bind(this)}
                            />
                        </div>
                    </div>
                </PageGrouping>
                <PageGrouping
                    hidden={!this.state.showResult}
                >
                    <div
                        className="row mb-3"
                    >
                        <div
                            className="col"
                        >
                            <StaticMatrix
                                matrixID={this.state.matrix3}
                            />
                        </div>
                    </div>
                </PageGrouping>
            </Page>
        );
    }
    showResult() {
        let m3;

        switch (this.state.op) {
            case OP_ID.ADD:
                m3 = matrices.add(this.state.matrix1, this.state.matrix2);
                break;
            case OP_ID.SUBTRACT:
                m3 = matrices.subtract(this.state.matrix1, this.state.matrix2);
                break;
            case OP_ID.MULTIPLY:
                m3 = matrices.multiply(this.state.matrix1, this.state.matrix2);
                break;
            case OP_ID.DIVIDE:
                m3 = matrices.divide(this.state.matrix1, this.state.matrix2);
                break;
            default: m3 = matrices.getMatrix(this.state.matrix2);
        }
        
        matrices.setMatrix(this.state.matrix3, m3);

        this.setState({showResult: true});
    }
    handleMatrixChange(id) {
        if (id === this.state.matrix1 || id === this.state.matrix2) {
            this.setState({showResult: false});
        }
    }
    handleOpChange(op) {
        if (this.state.op === OP_ID.NOP) {
            let nm2;

            switch (op) {
                case OP_ID.ADD:
                case OP_ID.SUBTRACT:
                    nm2 = matrices.empty(
                        matrices.getMatrixRows(this.state.matrix1),
                        matrices.getMatrixColumns(this.state.matrix1)
                    );
                    break;
                case OP_ID.MULTIPLY:
                case OP_ID.DIVIDE:
                    nm2 = matrices.identity(matrices.getMatrixColumns(this.state.matrix1));
            }

            matrices.setMatrix(this.state.matrix2, nm2);
        }

        this.setState({op: op, showResult: false});
    }
}

function launchApp() {
    document.getElementById("splash").className = "container splash-hidden";
    setTimeout(() => document.getElementById("main-fade-in").style.opacity = "1", 1);
    ReactDOM.render(
        <App/>,
        document.getElementById("main")
    );
}

function init() {
    if (document.readyState === "interactive") {
        if (!localStorage) {
            document.getElementById("launch").addEventListener("click", () => {
                launchApp();
            });
        } else {
            if (localStorage.getItem("hideSplash") === "yes") {
                launchApp();
            } else {
                document.getElementById("launch").addEventListener("click", () => {
                    localStorage.setItem("hideSplash", "yes");
                    launchApp();
                });
            }
        }
    } else {
        document.addEventListener("readystatechange", init);
    }
}

init();