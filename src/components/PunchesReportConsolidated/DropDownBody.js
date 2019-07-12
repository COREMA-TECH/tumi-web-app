import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";

class PunchesConsolidatedDropDownBody extends Component {
    state = {
        order: 'asc',
        orderBy: 'calories',
        selected: [],
        data: [],
        page: 0,
        rowsPerPage: 5,
        dataRolForm: [],
        openModalPicture: false
    };

    handleClickOpenModalPicture = (urlPicture) => {
        this.setState({
            openModalPicture: true,
            urlPicture: urlPicture
        });
    };

    handleCloseModalPicture = () => {
        this.setState({ openModalPicture: false });
    };

    render() {
        let { data } = this.props;

        let renderDialogPicture = () => (
            <Dialog maxWidth="md" open={this.state.openModalPicture} onClose={this.handleCloseModalPicture}>
                {/*<DialogTitle style={{ width: '800px', height: '800px'}}>*/}
                <img src={this.state.urlPicture} className="avatar-lg" />
                {/*</DialogTitle>*/}
            </Dialog>
        );

        return (
            <div className="DropdownBody">
                <table className="table DropdownBody-table">
                    <thead>
                        <tr>
                            <th>Actions</th>
                            <th className="Table-boldHead" scope="col">Name</th>
                            <th className="Table-boldHead" scope="col">Time in-out</th>
                            <th className="Table-boldHead" scope="col">Duration</th>
                            <th className="Table-boldHead" scope="col">Job</th>
                            <th className="Table-boldHead" scope="col">Location</th>
                            <th className="Table-boldHead" scope="col">Faces</th>
                        </tr>
                    </thead>
                    <tbody className="MuiTableBody-custom">
                        {data.map((item) => {
                            let fileSrcIn = "/images/placeholder.png";
                            let fileSrcOut = "/images/placeholder.png";
                            if (item.imageMarkedIn) {
                                fileSrcIn = item.imageMarkedIn;
                            }
                            if (item.imageMarkedOut) {
                                fileSrcOut = item.imageMarkedOut;
                            }
                            return (
                                <tr>
                                    <th>
                                        <button type="button" className="btn btn-success" onClick={_ => this.props.handleEditModal({...item}) }>
                                            <i className="fas fa-pen"></i>
                                        </button>
                                    </th>
                                    <td>{item.name}</td>
                                    <td>{item.clockIn} - {item.clockOut}</td>
                                    <td>{item.duration}</td>
                                    <td>{item.job}</td>
                                    <td>{item.hotelCode}</td>
                                    <td>
                                        <div className="avatar-container">
                                            <img className="avatar" src={fileSrcIn} />
                                            <div className="avatar-container-pic">
                                                <img className="avatar avatar-lg" src={fileSrcIn} onClick={() => {
                                                    this.handleClickOpenModalPicture(fileSrcIn)
                                                }} />
                                                <div className="avatar-description">
                                                    <h6 className="text-success ml-1 mt-3">{item.name}</h6>
                                                    <button className="btn avatar--flag" onClick={(e) => {
                                                        // document.getElementById('')
                                                        e.target.classList.toggle('unflag');
                                                    }}><i className="fas fa-flag flag" /></button>
                                                </div>
                                                <div className="arrow-up" />
                                            </div>
                                        </div>
                                        <div className="avatar-container">
                                            <img className="avatar" src={fileSrcOut} />
                                            <div className="avatar-container-pic">
                                                <img className="avatar avatar-lg" src={fileSrcOut} onClick={() => {
                                                    this.handleClickOpenModalPicture(fileSrcOut)
                                                }} />
                                                <div className="avatar-description">
                                                    <h6 className="text-success ml-1 mt-3">{item.name}</h6>
                                                    <button className="btn avatar--flag" onClick={(e) => {
                                                        // document.getElementById('')
                                                        e.target.classList.toggle('unflag');
                                                    }}><i className="fas fa-flag flag" /></button>
                                                </div>
                                                <div className="arrow-up" />
                                            </div>
                                        </div>
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

export default PunchesConsolidatedDropDownBody;

