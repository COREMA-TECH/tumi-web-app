import React, {Component} from 'react';
import './index.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell, faCog} from '@fortawesome/free-solid-svg-icons';

class Toolbox extends Component {
    render() {
        return (
            <div className="toolbox">
                <button type="submit" className="toolbox__button" data-toggle="dropdown">
                    <FontAwesomeIcon icon={faBell}/>
                </button>
                <button type="submit" className="toolbox__button">
                    <FontAwesomeIcon icon={faCog}/>
                </button>
            </div>
        );
    }
}

export default Toolbox;
