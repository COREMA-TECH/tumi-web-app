import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

class DropDownBody extends Component {

    handleDownload = (e, url) => {
        e.preventDefault();
        if(url) window.open(url, '_blank');
    }

    handleDateTime = (date) => {
        if(date) return moment(date).format('L LTS');
        else return ''
    }

    render() {
        let { data } = this.props;

        return (
            <div className="DropdownBody">
                <table className="table DropdownBody-table">
                    <thead>
                        <tr>
                            <th className="Table-boldHead" scope="col">Creation Date</th>
                            <th className="Table-boldHead" scope="col">Created by</th>
                            <th className="Table-boldHead" scope="col">Download</th>
                        </tr>
                    </thead>
                    <tbody className="MuiTableBody-custom">
                        {data.map((item) => {
                            return (
                                <tr>
                                    <td>{this.handleDateTime(item.createdAt)}</td>
                                    <td>{item.User ? item.User.Full_Name : ''}</td>
                                    <td>
                                        <Tooltip title="Download" >
                                            <button type="button" className="btn btn-success float-left mr-2" onClick={e => this.handleDownload(e, item.url)}>
                                                <i className="fas fa-download"></i>
                                            </button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default DropDownBody;

