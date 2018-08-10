import React, {Component} from 'react';
import './App.css';
import Main from "./Main/Main";
import {BrowserRouter as Router} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Main/>
                </div>
            </Router>
        );
    }
}


export default App;