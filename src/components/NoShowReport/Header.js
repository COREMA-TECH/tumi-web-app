import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import PropTypes from 'prop-types';

class HeaderNoShowReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            downloading: false
        }
    }

    render() {
        let { recruiter, leadEntered, sentToInterview, noShow, showed, hired } = this.props.header;

        return <div className="card-header bg-light">
            <div className="applicant-card__header">
                <span className="applicant-card__title">NO SHOW REPORT</span>
            </div>
            <div className="row">

                <div className="col-6">
                    <div className="NoShow-row">
                        TOTAL LEADS GENERATED {leadEntered}
                    </div>
                    <div className="NoShow-row">
                        <i className="fa fa-user" />
                        <span className="NoShow-label ml-1">
                            Recruiter: {recruiter}
                        </span>
                    </div>
                    <div className="NoShow-row">
                        <i className="fas fa-envelope-open-text" />
                        <span className="NoShow-label ml-1">
                            Lead Entered: {leadEntered}
                        </span>
                    </div>
                    <div className="NoShow-row">
                        <i className="fas fa-phone-square" />
                        <span className="NoShow-label ml-1">
                            Sent To Interview: {sentToInterview}
                        </span>
                    </div>
                </div>

                <div className="col-6">
                    <div className="NoShow-row">
                        REPORT PERIOD
                </div>
                    <div className="NoShow-row">
                        <span className="NoShow-label">
                            Showed: {showed}
                        </span>
                    </div>
                    <div className="NoShow-row">
                        <span className="NoShow-label">
                            No Show: {noShow}
                        </span>
                    </div>
                    <div className="NoShow-row">
                        <span className="NoShow-label">
                            Hired: {hired}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    }
}

HeaderNoShowReport.propTypes = {
    header: PropTypes.object.isRequired
};

export default withApollo(HeaderNoShowReport);