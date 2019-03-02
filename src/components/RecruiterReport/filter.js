import React, { Component } from 'react';

class RecruiterReportFilter extends Component {

    constructor(props) {
        super(props);
        var { recruiter, date, frequency } = props;
        this.state = { recruiter, date, frequency }
    }

    renderRecruiters = () => {
        return this.props.recruiters.map(item => {
            return <option key={item.Id} value={item.Id}>{item.Full_Name}</option>
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.recruiter != this.props.recruiter)
            this.setState(() => ({ recruiter: nextProps.recruiter }))
    }

    render() {
        let rol = localStorage.getItem('IdRoles');
        let disableRecruiter = rol == 4;

        return <div className="card-header bg-light">
            <div className="row">
                <div className="col-md-3 mt-1">
                    <select name="recruiter" className="form-control" value={this.state.recruiter} onChange={this.updateFilter} disabled={disableRecruiter}>
                        <option value="">Recruiters(All)</option>
                        {this.renderRecruiters()}
                    </select>
                </div>
                <div className="col-md-2 mt-1">
                    <select name="frequency" className="form-control" value={this.state.frequency} onChange={this.updateFilter}>
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                    </select>
                </div>
                <div className="col-md-2 mt-1">
                    <input name="date" className="form-control" type="date" value={this.state.date} onChange={this.updateFilter} />
                </div>
            </div>
        </div>
    }
}

export default RecruiterReportFilter;