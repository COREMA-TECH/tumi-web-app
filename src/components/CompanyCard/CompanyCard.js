import React from 'react';
import './index.css';

const CompanyCard = props => {
    return (
        <div className="card">
            <div className="card-image"></div>
            <div className="card-description">
                <p className="company-title">Company</p>
                <p className="company-description">Description of the company</p>
            </div>
        </div>
    );
};



export default CompanyCard;
