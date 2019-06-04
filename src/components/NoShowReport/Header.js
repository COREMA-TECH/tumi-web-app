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

        return (
            <React.Fragment>
                <span className="applicant-card__title">NO SHOW REPORT</span>
                <table style={{borderCollapse: "collapse", width: "100%"}} border="1">
                    <tbody>
                        <tr>
                            <td style={{width: "50%", backgroundColor: "#cbebea", color: "#2d4d40"}}>TOTAL LEADS GENERATED</td>
                            <td style={{width: "50%", backgroundColor: "#cbebea", color: "#2d4d40"}}>REPORT PERIOD</td>
                        </tr>
                        <tr>
                            <td style={{width: "50%", display: "tableCell", verticalAlign: "middle", backgroundColor: "#f2f2f2", color: "#2d4d40"}}><img style={{marginRight: "5px", marginLeft: "5px"}} src="/images/tumi-user.png" width="16" height="16" /> 
                                Recruiter: {recruiter}
                            </td>
                            <td style={{width: "50%", backgroundColor: "#f2f2f2", color: "#2d4d40"}}>
                                <p>Showed: {showed}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{width: "50%", display: "tableCell", verticalAlign: "middle", backgroundColor: "#f2f2f2", color: "#2d4d40"}}><img style={{marginRight: "5px", marginLeft: "5px"}} src="/images/tumi-mail.png" width="16" height="16" />
                                Lead Entered: {leadEntered}
                            </td>
                            <td style={{width: "50%", backgroundColor: "#f2f2f2", color: "#2d4d40"}}>No Show: {noShow}</td>
                        </tr>
                        <tr>
                            <td style={{width: "50%", display: "tableCell", verticalAlign: "middle", backgroundColor: "#f2f2f2", color: "#2d4d40"}}><img style={{marginRight: "5px", marginLeft: "5px"}} src="/images/tumi-phone.png" width="16" height="16" />
                                Sent To Interview: {sentToInterview}
                            </td>
                            <td style={{width: "50%", backgroundColor: "#f2f2f2", color: "#2d4d40"}}>Hired: {hired}</td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
    }
}

HeaderNoShowReport.propTypes = {
    header: PropTypes.object.isRequired
};

export default withApollo(HeaderNoShowReport);