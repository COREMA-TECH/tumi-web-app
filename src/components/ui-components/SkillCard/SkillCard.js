import React, {Component} from 'react';
import './index.css';

class SkillCard extends Component {
    constructor(props) {
        super();
    }

    render() {
        const {classes} = this.props;

        return (
            <div className="classes.skill_card">
                <div className="skill_card__description">{this.props.skillDescription}</div>
                <div className="classes.skill_card__level">{this.props.skillLevel}</div>
            </div>
        );
    }
}

export default SkillCard;