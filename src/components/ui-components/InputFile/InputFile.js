import React, {Component} from 'react';
import './index.css';

class InputFile extends Component {
    render() {
        {
            if (this.props.placeholder) {
                return (

                    <div class="input-file-container">
                        <input
                            type="text"
                            placeholder={this.props.placeholder}
                            className="input-form input-form--file"
                            onChange={(text) => {
                                // Send the text

                            }
                            }
                        />
                        <span className="input-form--file-button icon-attach" onClick={this.uploadHandler}></span>
                    </div>
                )
            } else {
                return (
                    <div class="input-file-container">
                        <input
                            type="text"
                            className="input-form input-form--file"
                            onChange={(text) => {
                                // Send the text

                            }
                            }
                        />
                        <span className="input-form--file-button" onClick={this.uploadHandler}><span className="icon-attach"></span></span>
                    </div>
                )
            }
        }
    }
}


InputFile.propTypes = {};

export default InputFile;
