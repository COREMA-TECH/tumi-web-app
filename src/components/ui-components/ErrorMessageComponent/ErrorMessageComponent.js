import React, {Component} from 'react';
import './index.css';

class ErrorMessageComponent extends Component {
    render() {
        return (
            <div className="error-container">
                <h1 className={[this.props.type,"Error-title"].join(" ")}>{this.props.title}</h1>
                <span className="Error-text">{this.props.message}</span>
            </div>
        );
    }
}

export default ErrorMessageComponent;