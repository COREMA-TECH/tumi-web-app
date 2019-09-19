import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import withApollo from 'react-apollo/withApollo';
import { UPDATE_MARKED_EMPLOYEE } from './Mutations';
import Tooltip from '@material-ui/core/Tooltip';

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

    handleFlagClick = (currentTarget, markedEmpId, flagValue) => {
        currentTarget.classList.toggle('bg-secondary');
        this.props.client
            .mutate({
                mutation: UPDATE_MARKED_EMPLOYEE,
                variables: {
                    markedemployees: { id: markedEmpId, flag: !flagValue }
                },
                fetchPolicy: 'no-cache'
            })
            .catch(error => {
                currentTarget.classList.toggle('bg-secondary');
            });
    }

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
                            let allowEditItem = !item.approvedDateIn && !item.approvedDateOut;
                            if (item.imageMarkedIn) {
                                fileSrcIn = item.imageMarkedIn;
                            }
                            if (item.imageMarkedOut) {
                                fileSrcOut = item.imageMarkedOut;
                            }
                            return (
                                <tr className={!allowEditItem ? 'PunchesReport-RowInfo' : ''} >
                                    <th>
                                        <Tooltip title={allowEditItem ? 'Edit Time' : 'View Time'} >
                                            <button type="button" className="btn btn-success" onClick={_ => this.props.handleEditModal({ ...item }, allowEditItem)}>
                                                <i className={`fas fa-${allowEditItem ? 'pen' : 'eye'}`} ></i>
                                            </button>
                                        </Tooltip>
                                    </th>
                                    <td>{item.name}</td>
                                    <td>{item.clockIn} - {item.clockOut}</td>
                                    <td>{item.duration == 0 ? '-' : item.duration}</td>
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
                                                    <button className={`btn avatar--flag ${!item.flagIn ? 'bg-secondary' : ''}`} onClick={(e) => {
                                                        this.handleFlagClick(e.currentTarget, item.clockInId, item.flagIn);
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
                                                    <button className={`btn avatar--flag ${!item.flagOut ? 'bg-secondary' : ''}`} onClick={(e) => {
                                                        this.handleFlagClick(e.currentTarget, item.clockOutId, item.flagOut);
                                                    }}><i className={`fas fa-flag flag`} /></button>
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

export default withApollo(PunchesConsolidatedDropDownBody);

