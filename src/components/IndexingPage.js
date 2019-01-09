import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Button, Icon, Dropdown, Input } from 'semantic-ui-react';
import Papa from 'papaparse';

import './IndexingPage.css';

const colors = ['rgba(0,146,146,0.2)', 'rgba(0,146,146,1)'];
const colorHover = 'rgba(0,146,146,0.6)';

const TIME_DIMENSIONS = [
    { size: 7,   label: 'Weekday' },
    { size: 12,  label: 'Month' },
    { size: 24,  label: 'Hour' },
    { size: 60,  label: 'Minute' },
    { size: 365, label: 'Date' }
];

const operatorOptions = [
  { key: 'lt', value: 'lt', text: '<' },
  { key: 'gt', value: 'gt', text: '>' },
];

const generateDropdownOptions = (headers) => {
    function makeDropDownOption(key, value, text) {
        return { key: key, value: value, text: text};
    }

    let headersLength = headers.length;
    let res = Array(headersLength);
    for (var i = 0; i < headersLength; ++i)
        res[i] = makeDropDownOption(headers[i], headers[i], headers[i]);

    return res;
}

class IndexingPage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            numberOfCells: 1,
            selectedDimensions: [0, 0, 0, 0, 0],
            doughnutData: {
                labels: TIME_DIMENSIONS.map(dim => dim.label),
                datasets: [{
                    data: [1, 1, 1, 1, 1],
                    backgroundColor: [colors[0], colors[0], colors[0], colors[0], colors[0]],
                    hoverBackgroundColor: [colorHover, colorHover, colorHover, colorHover, colorHover]
                }]
            },
            filter: {
                column: null,
                operator: null,
                value: null
            },
            addFilterActive: false
        };

        this.handleDoughnutClick = this.handleDoughnutClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleOperator = this.handleOperator.bind(this);
        this.handleFilterValue = this.handleFilterValue.bind(this);
        this.handleAddFilter = this.handleAddFilter.bind(this);
    }

    handleDoughnutClick(elem) {
        if (!elem[0])  return;
        this.props.clearFilters();
        this.setState({ filter: { column: null, operator: null, value: '' }});
        let index = elem[0]._index;

        // toggle dimensions.
        let selectedDimensions = this.state.selectedDimensions;
        selectedDimensions[index] = (selectedDimensions[index] + 1) % 2;

        // change color & deep copy
        let datasets = this.state.doughnutData.datasets.slice(0);
        let backgroundColor = datasets[0].backgroundColor.slice(0);
        backgroundColor[index] = colors[selectedDimensions[index]];
        datasets[0].backgroundColor = backgroundColor;

        // update number of cells
        let numberOfCells = this.state.numberOfCells;
        if (selectedDimensions[index])      numberOfCells *= TIME_DIMENSIONS[index].size;
        else                                numberOfCells /= TIME_DIMENSIONS[index].size;

        this.setState({
            selectedDimensions: selectedDimensions,
            doughnutData: Object.assign({}, this.state.doughnutData, {datasets: datasets}),
            numberOfCells: numberOfCells
        });
    }

    handleNextClick() {
        let selectedDimensionIndices = this.state.selectedDimensions;
        let selectedDimensions = TIME_DIMENSIONS.filter((elem, index) => selectedDimensionIndices[index] == 1);
        this.props.indexHandler(selectedDimensions);
    }

    handleCategory (event, data) {
        const { filter } = this.state;
        filter.column = data.value;
        this.setState({ filter, addFilterActive: filter.operator && filter.value && filter.value.length > 0 })
    }

    handleOperator (event, data) {
      const { filter } = this.state;
      filter.operator = data.value;
      console.log(filter)
      this.setState({ filter, addFilterActive: filter.column && filter.value && filter.value.length > 0 })
    }

    handleFilterValue (event, data) {
      const { filter } = this.state;
      console.log(filter);
      filter.value = data.value;
      this.setState({ filter, addFilterActive: filter.operator && filter.column && filter.value.length > 0 });
    }

    handleAddFilter () {
        const { filter } = this.state;
        this.setState({ filter: { column: null, operator: null, value: '' }});
        this.props.addFilter(Object.assign({ ...filter, value: Number(filter.value) }));
    }

    componentDidMount() {
        Papa.parse(this.props.selectedFile, {
            preview: 1,
            complete: (results) => {
                let csvHeaders = results.data[0].filter(header => header !== 'Time');
                this.dropdownOptions = generateDropdownOptions(csvHeaders);
                this.setState({yo: false});
            }
        });
    }

    render() {
        return (
            <div>
                <div style={{height: 550}}>
                    <h3 className="indexingMessage">Pick time magnitudes you'd like to rende your data with.</h3>

                    <Doughnut
                        className="dimension-selector"
                        data={this.state.doughnutData}
                        getElementsAtEvent={this.handleDoughnutClick}
                        height={440}
                        width={440}
                        options={{responsive: false}}
                    />

                    <div className="doughnut-center">
                        <p>{this.state.numberOfCells}</p>
                        <p>{'Cell' + (this.state.numberOfCells > 1 ? 's' : '')}</p>
                    </div>
                </div>

                <div style={{height: 100}}>
                    <div style={{margin: '0 auto', width: 'fit-content', display: 'flex', flexFlow: 'row nowrap'}}>
                        <Dropdown
                          placeholder='Column'
                          inline
                          search
                          selection
                          options={this.dropdownOptions}
                          tyle={{marginLeft:'10%'}}
                          onChange={this.handleCategory}
                          value={this.state.filter.column}
                        />
                        <Dropdown
                          options={operatorOptions}
                          placeholder='Operator'
                          inline search selection
                          style={{width:80, marginLeft:4}}
                          onChange={this.handleOperator}
                          value={this.state.filter.operator}
                        />
                        <Input inline placeholder='Value.' style={{width:140, marginLeft:4}} onChange={this.handleFilterValue} type='number' value={this.state.filter.value} />
                        <Button
                            color='blue'
                            style={{marginLeft: '7%', backgroundColor: 'rgb(0,146,146)'}}
                            onClick={this.handleAddFilter}
                            disabled={!this.state.addFilterActive}
                        >Add Filter</Button>
                    </div>

                    <div style={{margin: '0 auto', width: 'fit-content', fontSize: '1.5em'}}>
                        <ul>
                        {this.props.filters.map((filter, i) => (
                            <li key={i} style={{marginBottom: 4}} >{filter.column + ' ' + (filter.operator == 'lt' ? '<' : '>')  + ' ' + filter.value}</li>
                        ))}
                        </ul>
                    </div>

                </div>

                <div style={{height: 100}}>
                </div>
                
                <Button
                    style={{width: '70%', marginLeft: '15%', fontSize: '1.5em', backgroundColor: 'rgb(0,146,146)'}}
                    onClick={this.handleNextClick}
                    color='blue'
                >Next<Icon name='arrow alternate circle right outline'/></Button>
            </div>
        );
    }
}


export default IndexingPage;