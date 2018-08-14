import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './index.css';

class MyComponent extends Component {
    render() {
        return (
            <div className="create-company-form">
                <p>{this.props.title}</p>
            </div>
        );
    }
}

MyComponent.propTypes = {};

export default MyComponent;
