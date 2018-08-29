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
                           onChange={(text) => {
                                    //Send the text

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
                        onChange={(text) => {
                                // Send the text

                            }
                        }
                    />
                )
            }
        }
    }
}

export default InputForm;
