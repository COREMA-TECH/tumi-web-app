import React, {Component} from 'react';
import './index.css';
import Route from "react-router-dom/es/Route";
import Login from "../Login/Login";
import Private from "../Private/Private";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

class Main extends Component {
    render() {
        return (
            <div>
                <Route path="/login" component={Login}/>
                <PrivateRoute path="/home" component={Private}/>
            </div>
        );
    }
}

export default Main;
