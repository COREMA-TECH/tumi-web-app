import React, { Component } from 'react';

class Options extends Component {

    render() {
        return (
            <div className="MasterShift-options">
                <div className="row">
                    <div className="col-md-7">
                        <div class="can-toggle">
                            <input id="my-full" type="checkbox" />
                            <label for="my-full">
                                <div class="can-toggle__switch" data-checked="MY" data-unchecked="FULL"></div>
                            </label>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <button type="button" className="btn btn-link MasterShift-btn">
                            <i class="fas fa-print"></i>
                        </button>
                    </div>
                </div>
            </div>

        );
    }

}

export default Options;