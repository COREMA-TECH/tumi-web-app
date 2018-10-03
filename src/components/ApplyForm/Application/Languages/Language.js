import React, {Component} from 'react';
import '../index.css';

class Language extends Component {
    constructor(props){
        super(props);

        this.state = {
            // Editing state properties - To edit general info
            editing: false
        }
    }

    render() {
        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Languages</span>
                                {
                                    this.state.editing ? (
                                        ''
                                    ) : (
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.setState({
                                                editing: true
                                            })
                                        }}>Edit <i className="far fa-edit"></i>
                                        </button>
                                    )
                                }
                            </div>
                            <div className="row">

                            </div>
                            {
                                this.state.editing ? (
                                    <div className="applicant-card__footer">
                                        <button
                                            className="applicant-card__cancel-button"
                                            onClick={
                                                () => {
                                                    this.setState({
                                                        editing: false
                                                    })
                                                }
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                this.setState({
                                                    editing: false
                                                })
                                            }}
                                            className="applicant-card__save-button">
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Language;