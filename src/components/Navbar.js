import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e, { name }) { this.props.navbarClicked(name); }


    render() {
        const { selectedNavbarItem }  = this.props;

        return (
            <Menu inverted>
                <Menu.Item>
                    <img src='https://react.semantic-ui.com/logo.png' alt={'Failed to load resource'} />
                </Menu.Item>

                <Menu.Item name='upload' active={selectedNavbarItem === 'upload'} onClick={this.handleClick}>
                    {/* <Link to='/upload'><Icon name='file alternate' />Upload File</Link> */}
                    <Icon name='file alternate' />Upload File
                </Menu.Item>

                <Menu.Item name='indexing' active={selectedNavbarItem === 'indexing'} onClick={this.handleClick}>
                    {/* <Link to='/indexing'><Icon name='chart area' />Create Index</Link> */}
                    <Icon name='chart area' />Create Index
                </Menu.Item>

                <Menu.Item name='view' active={selectedNavbarItem === 'view'} onClick={this.handleClick}>
                    <Icon name='eye' />View
                </Menu.Item>
            </Menu>
        )
    }
}


export default Navbar;