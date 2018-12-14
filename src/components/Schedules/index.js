import Form from './Form.js';
import React, { Component } from 'react';

class Schedules extends Component {

    render() {
        return (
            <div className="MasterShift">
                <div className="row">
                    <div className="col-md-2">
                        <div className="MasterShift-formWrapper">
                            <div className="MasterShift-options">

                            </div>
                            <Form />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Schedules;