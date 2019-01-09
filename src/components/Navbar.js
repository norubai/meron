import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Menu inverted>
                <Menu.Item>
                    <img src='https://react.semantic-ui.com/logo.png' alt={'Failed to load resource'} />
                </Menu.Item>

                <Menu.Item name='upload' active={activeItem === 'upload'} onClick={this.handleClick}>
                    <Link to='/upload'><Icon name='file alternate' />Upload File</Link>
                </Menu.Item>

                <Menu.Item name='indexing' active={activeItem === 'indexing'} onClick={this.handleClick}>
                    <Link to='/indexing'><Icon name='chart area' />Create Index</Link>
                </Menu.Item>

                <Menu.Item name='view' active={activeItem === 'view'} onClick={this.handleClick}>
                    <Icon name='eye' />View
                </Menu.Item>
            </Menu>
        )
    }
}


export default Navbar;