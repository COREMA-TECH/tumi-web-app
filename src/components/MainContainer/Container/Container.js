import React, {Component} from 'react';
import './index.css';
import {Route} from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';
import CreateCompany from '../../Company/CreateCompany/CreateCompany';
import Contract from "../../Contract/Contract";

class Container extends Component {
    render() {
        return (
            <div className="container">
                <Route exact path="/home/contract" component={Contract}/>
                <Route exact path="/home/company" component={CompanyList}/>
                <Route exact path="/home/company/add" component={CreateCompany}/>
                <Route exact path="/home/company/edit" component={CreateCompany}/>
            </div>
        );
    }
}

export default Container;
