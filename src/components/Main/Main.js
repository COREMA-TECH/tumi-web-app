import React, {Component} from 'react';
import './index.css';
import Nav from '../Nav/Main';
import MainContainer from '../MainContainer/Main/MainContainer';
import Route from "react-router-dom/es/Route";
import Login from "../Login/Login";

class Main extends Component {
    render() {
        return (
            <div className="main">
                <Route path="/login" component={Login} />
                {/*<Nav/>*/}
                {/*<MainContainer/>*/}
            </div>
        );
    }
}

export default Main;
