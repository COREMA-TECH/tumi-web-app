import React, { Component } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

class TableNoShowReport extends Component {
    constructor(props) {
        super(props);        
    }

    getTableData = () => {
        let { data } = this.props;

        return data.map(_ => (
            <tr>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {`${_.application.firstName} ${_.application.lastName}`}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {_.application.cellPhone}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {`${_.application.cityInfo ? _.application.cityInfo.Description : ''},${_.application.stateInfo ? _.application.stateInfo.Description : ''}`}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {_.application.idealJobs ? _.application.idealJobs.map(_job => _job.description).toString() : ''}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {_.application.car ? 'Yes' : 'No'}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {_.application.idWorkOrder || 'Open'}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {_.application.position ? _.application.position.position.Position : 'Open'}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {_.application.position ? _.application.position.BusinessCompany.Name : 'n/a'}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {_.application.position ? _.application.position.position.department.Description : 'n/a'}
                </td>
                <td style={{width: "10%", textAlign: 'center', padding: "5px"}}>
                    {moment.utc(_.createdAt).format("MM/DD/YYYY")}
                </td>
            </tr>
        ))
    }

    render() {
        let { data } = this.props;

        return (
            <React.Fragment>
                <table style={{borderCollapse: "collapse", width: "100%"}} border="1">
                    <tbody>
                        <tr>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Lead Name</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Phone Number</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>City/State</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Willing to Work As</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Transportation</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Work Order #</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Position</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Hotel</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Department</strong></td>
                            <td style={{width: "10%", textAlign: 'center', backgroundColor: "#2d4d40", color: "white"}}><strong>Sent to Interview Date</strong></td>
                        </tr>
                        {this.getTableData()}
                    </tbody>
                </table>            
            </React.Fragment>
        );
    }
}

TableNoShowReport.propTypes = {
    data: PropTypes.object.isRequired
};

export default TableNoShowReport;