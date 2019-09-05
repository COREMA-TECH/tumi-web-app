import React, { Component } from 'react';

class PunchesReportDetailFilter extends Component {

    DEFAULT_STATE = {
        endDateDisabled: true
    }

    constructor(props) {
        super(props);
        var { startDate, endDate } = props;
        this.state = { startDate, endDate, ...this.DEFAULT_STATE };
    }

    handleChangeDate = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(() => ({
            [name]: value,
            endDateDisabled: false
        }),
            () => {
                if (this.props.updateFilter)
                    this.props.updateFilter(this.state)
            });
    }

    updateFilter = (event) => {
        let object = event.target;
        this.setState(() => ({ [object.name]: object.value }),
            () => {
                if (this.props.updateFilter)
                    this.props.updateFilter(this.state)
            })
    }

    render() {
        return <div className="card-header bg-light">
            <div className="row">
                <div className="col-md-4 mt-1 pl-0">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">From</span>
                        </div>
                        <input type="date" className="form-control" placeholder="2018-10-30"
                            value={this.state.startDate} name="startDate" onChange={this.handleChangeDate} />
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">To</span>
                        </div>
                        <input type="date" className="form-control" name="endDate" value={this.state.endDate}
                            disabled={this.state.endDateDisabled} placeholder="2018-10-30"
                            onChange={this.updateFilter} />
                    </div>
                </div>

            </div>

        </div>
    }
}

export default PunchesReportDetailFilter;