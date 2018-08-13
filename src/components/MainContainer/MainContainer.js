import React, {Component} from 'react';
import './index.css';
import Toolbar from "../Toolbar/Main/Toolbar";
import CreateCompany from "../Company/CreateCompany/CreateCompany";
import Route from "react-router-dom/es/Route";
import CompanyCard from "./CompanyCard/CompanyCard";

class MainContainer extends Component {
    render() {
        return (
            <div className="container">
                <Toolbar/>
                <div className="content-main">
                    <Route exact path="/company" component={CompanyCard}/>
                    <Route exact path="/company/add" component={CreateCompany}/>
                </div>
            </div>
        );
    }
}

MainContainer.propTypes = {};

export default MainContainer;
