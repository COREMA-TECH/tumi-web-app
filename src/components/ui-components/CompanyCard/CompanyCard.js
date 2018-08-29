import React from 'react';
import './index.css';
import DeleteIcon from '@material-ui/icons/Delete';

const CompanyCard = (props) => (
    <div className="company-card" onClick={() => {
        //Redirect and send the id
    }
    }>
        <div className="company-card__header">
            <div className="company-card__header-options">
                <DeleteIcon className="delete-company-icon"/>
            </div>
            <img src={props.url} alt="" className="avatar"/>
        </div>
        <div className="company-card__body">
            <div className="company-card__title">{props.name}</div>
            <div className="company-card__description">{props.description}</div>
        </div>
    </div>
);

export default CompanyCard;
