import React, { Component } from 'react';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';

import WelcomeScene from './components/WelcomeScene.js';
import Visuals from './components/Visuals.js';
import Navbar from './components/Navbar.js';
import IndexingPage from './components/IndexingPage.js';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.selectedFile = null;
        this.selectedTimeDimensions = null;

        this.state = {
            // filter = {value: number, operator: string, column: string}
            filters: [],
            selectedFile: null,
            selectedTimeDimensions: null,
            selectedNavbarItem: null
        }

        this.fileHandler = this.fileHandler.bind(this);
        this.indexHandler = this.indexHandler.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.navbarClicked = this.navbarClicked.bind(this);
    }

    navbarClicked(name) {
        let { selectedNavbarItem } = this.state;
        switch(name) {
            case 'upload':
                this.props.history.push('/upload');
                selectedNavbarItem = 'upload';
                break;
            case 'indexing':
                if (this.state.selectedFile)
                    this.props.history.push('/indexing');
                selectedNavbarItem = 'indexing';
                break;
            case 'view':
                if (this.state.selectedFile && this.state.selectedTimeDimensions) {
                    this.props.history.push('/view')
                    selectedNavbarItem = 'view';
                }
            break;
        }

        if (selectedNavbarItem != this.state.selectedFile)
            this.setState({selectedNavbarItem: selectedNavbarItem});
    }

    clearFilters() { this.setState({filters: []}); }

    fileHandler(e) {
        if (!e.target.files) return;
        this.setState({
          selectedFile: e.target.files[0]
        }, () => {
          this.props.history.push('/indexing');
        })
    }

    indexHandler(selectedTimeDimensions) {
      this.setState({ selectedTimeDimensions }, () => {
        this.props.history.push('/view');
      })
    }

    addFilter (filter) {
      const { filters } = this.state;
      const newFilters = [ ...filters, filter ];
      this.setState({ filters: newFilters }, () => { console.log(this.state.filters )})
    }

    render() {
        const { selectedFile, selectedTimeDimensions, filters, selectedNavbarItem } = this.state;
        return (
            <div className="page-container">
                <Navbar selectedNavbarItem={selectedNavbarItem} navbarClicked={this.navbarClicked}/>
                <div className="page-content">
                    <Switch>
                        <Redirect exact from='/' to='/upload'/>
                        <Route exact path="/upload" render={() => (<WelcomeScene fileHandler={this.fileHandler}/>)} />
                        <Route path="/indexing" render={() => (
                            <IndexingPage
                                indexHandler={this.indexHandler}
                                selectedFile={selectedFile}
                                addFilter={this.addFilter}
                                filters={this.state.filters}
                                clearFilters={this.clearFilters}
                            />
                        )}/>
                        <Route path="/view" render={() => (
                            <Visuals
                                selectedFile={selectedFile}
                                selectedTimeDimensions={selectedTimeDimensions}
                                selectedFilters={filters}
                            />
                        )}/>
                    </Switch>
                </div>
            </div>
        );
    }
}


export default withRouter(App);
