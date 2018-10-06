import React, {Component} from 'react';
import './index.css';

class SkillCard extends Component {
    constructor(props) {
        super();
    }

    render() {
        const {classes} = this.props;

        return (
            <div className="skill-card">
                <span
                    className="skill-card__remove-button"
                    onClick={()=> {this.props.removeSkill()}}>
                    <i className="fas fa-trash-alt"></i>
                </span>
                <div className="skill-card__description applicant-card__label">{this.props.skillDescription}</div>
                <div className="skill-card__level applicant-card__label">{this.props.skillLevel}</div>
            </div>
        );
    }
}

export default SkillCard;