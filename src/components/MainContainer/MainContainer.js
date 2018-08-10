import React, {Component} from 'react';
import CompanyCard from "../CompanyCard/CompanyCard";
import './index.css';
import Toolbar from "../Toolbar/Main/Toolbar";

class MainContainer extends Component {
    render() {
        return (
            <div className="container">
                <Toolbar/>
                <CompanyCard/>
                <CompanyCard/>
                <CompanyCard/>
                <CompanyCard/>
                <CompanyCard/>
                <CompanyCard/>
                <CompanyCard/>
                <CompanyCard/>
                <CompanyCard/>
            </div>
        );
    }
}

MainContainer.propTypes = {};

export default MainContainer;
