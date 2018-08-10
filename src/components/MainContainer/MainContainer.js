import React, {Component} from 'react';
import CompanyCard from "../CompanyCard/CompanyCard";
import './index.css';

class MainContainer extends Component {
    render() {
        return (
            <div className="container">
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
