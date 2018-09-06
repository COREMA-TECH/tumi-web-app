import React, {Component} from 'react';
import './index.css';

class TextAreaForm extends Component {
    render() {
        {
            if (this.props.placeholder) {
                return (
                    <textarea type="text"
                           value={this.props.value}
                           className="input-form input-form--textarea"
                           placeholder={this.props.placeholder}
                           onChange={(event) => {
                                  this.props.change(event.target.value);
                                }
                           }
                    />
                )
            } else {
                return (
                    <textarea
                        type="text"
                        value={this.props.value}
                        className="input-form input-form--textarea"
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

export default TextAreaForm;
