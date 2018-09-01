import React, {Component} from 'react';
import './index.css';

class InputForm extends Component {
    render() {
        {
            if (this.props.placeholder) {
                return (
                    <input type="text"
                           value={this.props.value}
                           className="input-form"
                           placeholder={this.props.placeholder}
                           onChange={(event) => {
                               this.props.change(event.target.value);
                           }
                           }
                    />
                )
            } else {
                return (
                    <input
                        type="text"
                        value={this.props.value}
                        className="input-form"
                        onChange={(event) => {
                                this.props.change(event.target.value);
                            }
                        }
                    />
                )
            }
        }
    }
}

export default InputForm;
