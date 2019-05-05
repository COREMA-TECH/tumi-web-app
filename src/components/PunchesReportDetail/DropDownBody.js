import React, { Component } from 'react';

class PunchesDetailDropDownBody extends Component {
    state = {
        order: 'asc',
        orderBy: 'calories',
        selected: [],
        data: [],
        page: 0,
        rowsPerPage: 5,
        dataRolForm: []
    };

    render() {
        let { data } = this.props;
        return (
            <table className="table">
                {/* <thead className="thead-dark">
                    <tr>
                        <th scope="col">Time in-out</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Job</th>
                        <th scope="col">Location</th>
                        <th scope="col">Faces</th>
                        <th scope="col">Notes</th>
                    </tr>
                </thead> */}
                <tbody>
                    {data.map((item) => {
                        return (
                            <tr>
                                <td>{item.clockIn} - {item.clockOut}</td>
                                <td>{item.duration}</td>
                                <td>{item.job}</td>
                                <td>{item.hotelCode}</td>
                                <td></td>
                                <td>{item.notes}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export default PunchesDetailDropDownBody;

