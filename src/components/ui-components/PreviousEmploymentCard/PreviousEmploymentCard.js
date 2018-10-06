import React, {Component} from 'react';
import'./index.css';

class PreviousEmploymentCard extends Component {
    render() {
        return (
            <div className="previous-employment-card">
                <span
                    className="skill-card__remove-button"
                    onClick={()=> {this.props.removeSkill()}}>
                    <i className="fas fa-trash-alt"></i>
                </span>
                <div className="previous-employment-card__job-title applicant-card__label">Programmer</div>
                <div className="previous-employment-card__company">
                    <i className="fas fa-building"></i><span> Google</span>
                </div>
                <div className="previous-employment-card__address">
                    <i className="fas fa-map-marker-alt"></i><span> San Francisco, California</span>
                </div>
            </div>
        );
    }
}

export default PreviousEmploymentCard;