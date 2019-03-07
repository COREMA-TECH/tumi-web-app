import React, { Component } from 'react';

class PunchesReportFilter extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="card-header bg-light">
            <div className="row">
                <div className="col-md-3 mt-1">
                    <select name="property" className="form-control"  >
                        <option value="">Property(All)</option>
                    </select>
                </div>
                <div className="col-md-2 mt-1">
                    <select name="department" className="form-control"  >
                        <option value="">Department(All)</option>
                    </select>
                </div>
                <div className="col-md-2 mt-1">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                        </div>
                        <input name="employee" className="form-control" type="text" placeholder='Employee Search' />
                    </div>
                </div>
                <div className="col-md-5 mt-1">
                    <button class="btn btn-success float-right">Add Time<i class="fas fa-plus ml-1"></i></button>
                </div>
            </div>
        </div>
    }
}

export default PunchesReportFilter;