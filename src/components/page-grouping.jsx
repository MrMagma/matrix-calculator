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

import uid from "../util/uid.js";
import grouping from "../controller/grouping-controller.js";

import style from "../styles/page-grouping.css";

export default class PageGrouping extends React.Component {
    constructor(props) {
        super(props);

        this.id = uid();
    }
    render() {
        return (
            <div
                className={`${style["page-grouping"]} ${this.props.hidden ? style["hidden"] : style["shown"]}`}
                id={this.id}
            >
                {this.props.children}
            </div>
        );
    }
    componentDidMount() {
        grouping.add(this.id, this.props.hidden);
    }
    componentWillUnmount() {
        grouping.remove(this.id);
    }
    componentDidUpdate() {
        grouping.update(this.id, this.props.hidden);
    }
}

PageGrouping.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
        React.PropTypes.node.isRequired
    ]),
    hidden: PropTypes.bool
};