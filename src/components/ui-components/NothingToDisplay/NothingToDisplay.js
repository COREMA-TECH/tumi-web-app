import React, {Component} from 'react';
import './index.css';

class NothingToDisplay extends Component {
    render() {
        return (
            <div className="nothing-container">
                <span className="nothing-text">{this.props.message}</span>
                <img className="nothing-image" src={this.props.url} alt=""/>
            </div>
        );
    }
}

export default NothingToDisplay;