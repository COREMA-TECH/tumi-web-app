import React, { Component } from 'react';

class PunchesConsolidatedDropDownBody extends Component {
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
        console.log(data)
        return (
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Time in-out</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Job</th>
                        <th scope="col">Location</th>
                        <th scope="col">Faces</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        return (
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.clockIn} - {item.clockOut}</td>
                                <td>{item.duration}</td>
                                <td>{item.job}</td>
                                <td>{item.hotelCode}</td>
                                <td></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export default PunchesConsolidatedDropDownBody;

