import React, {Component} from 'react';
import './index.css';

class ErrorMessageComponent extends Component {
    render() {
        return (
            <div className="error-container">
                <span className="error-text">{this.props.message}</span>
                <img className="error-image" src={this.props.url} alt=""/>
            </div>
        );
    }
}

export default ErrorMessageComponent;