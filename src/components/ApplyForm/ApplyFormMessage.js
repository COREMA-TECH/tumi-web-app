import React, { Component } from 'react';
import './index.css';
import Route from "react-router-dom/es/Route";

class ApplyFormMessage extends Component {
    render() {
        return (
            <Route
                render={({ history }) => (
                    <div className="Apply-emoji">
                        <div className="row">
                            <img src="/icons/successfully.png" />
                        </div>
                        <div className="row">
                            <div className="apply-form-container__messages">
                                <div className="col-12">
                                    <span>Successfully Created!</span>
                                </div>
                                <div className="col-12">
                                    <button className="save-skill-button" onClick={() => {
                                        history.push({
                                            pathname: '/employment-application'
                                        });
                                    }}>New Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )} />
        );
    }
}

export default ApplyFormMessage;