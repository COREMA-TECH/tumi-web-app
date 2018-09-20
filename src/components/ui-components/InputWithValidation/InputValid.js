import React, {Component} from 'react';
import './index.css';

class InputValid extends Component {
    render() {
        return (
            <input
                type={this.props.type}
                id={this.props.id}
                value={this.props.value}
                className={'input-form'}
                required
                min="0"
                placeholder={this.props.placeholder && ''}
                maxLength={this.props.maxLength}
                disabled={this.props.disabled}
                onChange={(event) => {
                    this.props.change(event.target.value);
                }}
            />
        );
    }
}

export default InputValid;