import React, {Component} from 'react';
import './index.css';
import Search from '../SearchBar';
import Toolbox from '../Toolbox';

class Toolbar extends Component {
    render() {
        return (
            <div className="toolbar__main">
                <Search/>
                <Toolbox/>
            </div>
        );
    }
}

export default Toolbar;
