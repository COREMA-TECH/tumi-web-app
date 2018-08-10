import React, {Component} from 'react';
import './index.css';
import Nav from "../Nav/";
import Toolbar from '../Toolbar/Main';

class Main extends Component {
    render() {
        return (
            <div className="main">
                <Nav/>
                <Toolbar/>
            </div>
        );
    }
}


export default Main;
