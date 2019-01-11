import React, { Component } from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import Papa from 'papaparse';

import './Visuals.css';
import Graph from './Graph.js';
import Tensor from '../tensorClasses/Tensor.js';
import { LABEL_DICT, AXIS_DICT } from '../tensorClasses/Constants.js';


const generateDropdownOptions = (headers) => {
    function makeDropDownOption(key, value, text) {
        return { key: key, value: value, text: text};
    }

    let headersLength = headers.length;
    let res = Array(headersLength + 1);
    for (var i = 0; i < headersLength; ++i)
        res[i] = makeDropDownOption(headers[i], headers[i], headers[i]);
    res[headersLength] = makeDropDownOption('__occurrence', '__occurrence', 'Occurrence');

    return res;
}

const cleanState = {
    xLabels: null,
    yLabels: null,
    graphData: null,
    graphDataNew: null
};


class Visuals extends Component {
    constructor(props) {
        super(props);

        let isButtonActive = Array(props.selectedTimeDimensions.length).fill(0);
        this.state = {
            isButtonActive: isButtonActive,
            loading: false,
            selectedChannel: '',
            ...cleanState
        };

        this.timeDimensionLabels = this.props.selectedTimeDimensions.map(dim => dim.label);
        this.csvHeaders = null;
        this.tStorage = null;
        this.tensor = null;
        this.dropdownOptions = null;

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    componentDidMount() {
        Papa.parse(this.props.selectedFile, {
            dynamicTyping: true,
            header: true,
            complete: (results) => {
                var csvHeaders = results.meta.fields.filter(header => header !== 'Time');
                this.dropdownOptions = generateDropdownOptions(csvHeaders);
                this.tensor = new Tensor(
                    results.data,
                    this.props.selectedTimeDimensions,
                    csvHeaders,
                    this.props.selectedFilters
                );
                this.setState({ loading: false });
            }
        });
        this.projectionHandler = this.projectionHandler.bind(this);
    }



    projectionHandler() {
        var trueButtonsNew = [];
        var xLabels, yLabels, graphData; var graphDataNew;

        let isButtonActive  = this.state.isButtonActive;
        for (var i = 0, isButtonActiveSize = isButtonActive.length; i < isButtonActiveSize; ++i ) {
            if (isButtonActive[i])
                trueButtonsNew.push(i);
        }

        // do nothing if no button is active.
        if (trueButtonsNew.length === 0) return;

        let [trueButtonIndex0, trueButtonIndex1] = trueButtonsNew;
        // if one button is active --> graph is a bar chart. set yLabes = null. xLabels = LABEL_DICT[trueButton[0]].
        if (trueButtonsNew.length === 1) {
            graphDataNew = this.tensor.project(trueButtonsNew, this.state.selectedChannel);
            xLabels = LABEL_DICT[this.timeDimensionLabels[trueButtonIndex0]];
            yLabels = null;
        }
        // falseButtons.length == 1 --> graph is a heatmap. set x and y labels.
        else {
            graphDataNew = this.tensor.project(trueButtonsNew, this.state.selectedChannel)
            xLabels = LABEL_DICT[this.timeDimensionLabels[trueButtonIndex1]];
            yLabels = LABEL_DICT[this.timeDimensionLabels[trueButtonIndex0]];

        }

        this.setState({ xLabels: xLabels, yLabels: yLabels, graphData: graphData, graphDataNew: graphDataNew });
    }

    handleButtonClick(evt, buttonIndex) {
        evt.target.blur();
        let isButtonActive = this.state.isButtonActive;

        let noChannelIsActive = this.state.selectedChannel == '';
        let buttonLimit = isButtonActive[buttonIndex] == 0 && isButtonActive.reduce((a, b) => a + b) == 2
        if (noChannelIsActive || buttonLimit)
            return;

        isButtonActive[buttonIndex] = (isButtonActive[buttonIndex] + 1) % 2;
        this.setState({isButtonActive: isButtonActive}, this.projectionHandler);
    }

    render() {
        let buttons = this.timeDimensionLabels.map((label, i) => (
            <Button
                toggle
                active={this.state.isButtonActive[i] == 1}
                onClick={(evt) => this.handleButtonClick(evt, i)}
                className='our-button'
                key={i}
            >{label}</Button>
        ));
        if (this.state.loading) {
            return (<h1> LOADING </h1>);
        }
        else {
            return (
                <div className="pan">
                    <div className="widgets-container">
                        <h4>Select channel and time dimensions.</h4>

                        <Dropdown
                            fluid
                            selection
                            placeholder="Select"
                            options={this.dropdownOptions}
                            onChange={(evt, data) => this.setState({...cleanState, selectedChannel: data.value})}
                        />

                        <Button.Group className="our-button-group">
                            {buttons}
                        </Button.Group>
                    </div>

                    <div className="graph-container">
                        <Graph
                            id="heatmap"
                            yLabels={this.state.yLabels}
                            xLabels={this.state.xLabels}
                            graphData={this.state.graphDataNew}
                        />
                    </div>
                </div>
            );

        }
    }
}

export default Visuals;