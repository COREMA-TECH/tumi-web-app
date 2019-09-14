import React from 'react';
import withApollo from 'react-apollo/withApollo';
import PropTypes from 'prop-types';

const LABELTEXTSIZE = { fontSize: '1vw' };
const TIMETEXTSIZE = { fontSize: '1.7vw' };

class ApprovePunchesReportTable extends React.Component {

    constructor(props) {
        super(props);
    }

    approveMarks = (rowId, list) => (e) => {
        let idsToApprove = list.map(_ => _.id);
        this.props.approveMarks(rowId, idsToApprove);
    }

    unapproveMarks = (rowId, list) => (e) => {
        let idsToUnapprove = list.map(_ => _.id);
        this.props.unapproveMarks(rowId, idsToUnapprove);
    }

    handleCheckedChange = (rowId) => (e) => {
        let value = e.target.checked;
        let data = [...this.props.data];

        data.find(_ => _.id == rowId).selected = value;
        this.props.updateData(data);
    }

    openViewDetails = (e, EmployeeId) => {
        e.preventDefault();
        this.props.handleOpenModalDetails(EmployeeId);
    }

    render() {
        let { rowsId, approving, unapproving } = this.props;

        return (
            <React.Fragment>
                {this.props.data.map(_ => {
                    let hasUnapproved = _.detailUnapproved.length !== 0;
                    let hasApproved = _.detailApproved.length !== 0;

                    return <div className="card mt-1 mb-1 ApprovePunches">
                        <div className="card-body pt-0 pb-0">
                            <div className="row">
                                <div className="col-lg-1 col-sm-12 ApprovePunches-separation tumi-col-centered">
                                    <div className="ApprovePunches-employeeContainer">
                                        <input type="checkbox" class="mr-2" checked={_.selected} onChange={this.handleCheckedChange(_.id)} />
                                        <p className="AppovePunches-valueLabel font-weight-bold mb-0 text-uppercase">{_.fullName}</p>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-sm-12 ApprovePunches-separation">
                                    <div className="d-block mb-2">
                                        <button className={`btn btn-sm ${hasUnapproved ? 'btn-success' : 'btn-secondary'} mr-1 btn-approve`} disabled={!hasUnapproved} onClick={this.approveMarks(_.id, _.detailUnapproved)}>
                                            Approve {rowsId.find(value => value === _.id) && approving ? < i class="fas fa-spinner fa-spin ml-1" /> : <React.Fragment />}
                                        </button>
                                        <span className="ApprovePunches-approvedLabel">{`Approved at( ${_.approvedDate})`}</span>
                                    </div>
                                    <div className="d-block">
                                        <button className={`btn btn-sm  ${hasApproved ? 'btn-danger' : 'btn-secondary'}  mr-1 btn-approve`} disabled={!hasApproved} onClick={this.unapproveMarks(_.id, _.detailApproved)}>
                                            Unapprove {rowsId.find(value => value === _.id) && unapproving ? < i class="fas fa-spinner fa-spin ml-1" /> : <React.Fragment />}
                                        </button>
                                    </div>

                                </div>
                                <div className="col-lg-3 col-sm-12 d-flex justify-content-between">
                                    <div className="my-auto">
                                        <p className="ApprovePunches-titleLabel font-weight-bold">TOTAL</p>
                                        <p className="ApprovePunches-titleLabel font-weight-bold ApprovePunches-titleHours">WORKED HOURS</p>
                                        <a href="#" className="badge badge-success badge-sm" onClick={(e) => this.openViewDetails(e, _.id)}>View Details</a>
                                    </div>
                                    <div className="my-auto">
                                        <p className="ApprovePunches-valueLabel font-weight-bold"> : </p>
                                    </div>
                                    <div className="my-auto align-content-center">
                                        <p className="ApprovePunches-valueLabel font-weight-bold">
                                            {`${_.unapprovedWorkedTime + _.approvedWorkedTime}H`}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-12 d-flex justify-content-between">
                                    <div className="my-auto">
                                        <p className="ApprovePunches-titleLabel font-weight-bold">TOTAL</p>
                                        <p className="ApprovePunches-titleLabel font-weight-bold ApprovePunches-titleHours">APPROVED HOURS</p>
                                    </div>
                                    <div className="my-auto">
                                        <p className="ApprovePunches-valueLabel font-weight-bold"> : </p>
                                    </div>
                                    <div className="my-auto align-content-center">
                                        <p className="ApprovePunches-valueLabel font-weight-bold text-success">
                                            {`${_.approvedWorkedTime}H`}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-12 d-flex justify-content-between">
                                    <div className="my-auto">
                                        <p className="ApprovePunches-titleLabel font-weight-bold">TOTAL</p>
                                        <p className="ApprovePunches-titleLabel font-weight-bold">UNAPPROVED HOURS</p>
                                    </div>
                                    <div className="my-auto">
                                        <p className="ApprovePunches-valueLabel font-weight-bold"> : </p>
                                    </div>
                                    <div className="my-auto align-content-center">
                                        <p className="ApprovePunches-valueLabel font-weight-bold text-danger">
                                            {`${_.unapprovedWorkedTime}H`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </React.Fragment>

        );
    }
}

ApprovePunchesReportTable.propTypes = {
    data: PropTypes.array.isRequired,
    approving: PropTypes.bool.isRequired,
    unapproving: PropTypes.bool.isRequired,
    approveMarks: PropTypes.func.isRequired,
    unapproveMarks: PropTypes.func.isRequired,
    rowsId: PropTypes.array.isRequired,
    updateData: PropTypes.func.isRequired
};

export default withApollo(ApprovePunchesReportTable);