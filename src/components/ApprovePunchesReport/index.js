import React, { Component } from 'react';
import Table from './table';
import Filter from './filter';
import withGlobalContent from 'Generic/Global';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import moment from 'moment';
import { GET_REPORT_QUERY, GET_PUNCHES_REPORT_CONSOLIDATED } from './queries';
import { APPROVE_MARKS, UNAPPROVE_MARKS } from './mutations';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import DropDown from '../PunchesReportConsolidated/DropDown';
import TimeCardForm from '../TimeCard/TimeCardForm';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

const DialogTitle = (props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography style={{
            margin: 0,
            padding: 10,
        }}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" style={{
                    position: 'absolute',
                    right: 30,
                    top: 22,
                    color: "#9e9e9e",
                }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

class ApprovePunchesReport extends Component {

    DEFAULT_STATE = {
        data: [],
        rowsId: [],
        approving: false,
        unapproving: false,
        openModalDetails: false,
        modalDetailsData: [],
        openTimeModal: false,
        timeModalData: {},
        editTimeModal: false
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }

    componentWillMount() {
        this.getReport();
    }

    getReport = () => {
        this.setState(() => ({ loadingReport: true }), () => {
            this.props.client
                .query({
                    query: GET_REPORT_QUERY,
                    fetchPolicy: 'no-cache',
                    variables: this.getFilters()
                })
                .then(({ data }) => {
                    this.setState(() => ({
                        data: data.approvePunchesReport,
                        loadingReport: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingReport: false, data: [] }));
                });
        })
    }

    approveMarks = (rowsId, idsToApprove, callback = () => { }) => {
        this.setState(() => ({ approving: true, rowsId: Array.isArray(rowsId) ? rowsId : [rowsId] }));
        callback("A");//Approving
        this.props.client.mutate({
            mutation: APPROVE_MARKS,
            variables: {
                approvedDate: this.state.endDate,
                idsToApprove
            }
        })
            .then(({ data: { approveMarks } }) => {
                this.props.handleOpenSnackbar('success', 'Data successfully processed');
                this.setState(() => ({ approving: false }), this.getReport);
                callback("F");//Approving
            })
            .catch(_ => {
                callback("E");//Approving
                this.props.handleOpenSnackbar('error', 'Error approving record');
                this.setState(() => ({ approving: false }));
            })
    }

    unapproveMarks = (rowsId, idsToUnapprove) => {
        this.setState(() => ({ unapproving: true, rowsId: Array.isArray(rowsId) ? rowsId : [rowsId] }));
        this.props.client.mutate({
            mutation: UNAPPROVE_MARKS,
            variables: {
                idsToUnapprove
            }
        })
            .then(({ data: { unapproveMarks } }) => {
                this.props.handleOpenSnackbar('success', 'Data successfully processed');
                this.setState(() => ({ unapproving: false }), this.getReport);
            })
            .catch(_ => {
                this.props.handleOpenSnackbar('error', 'Error unapproving record');
                this.setState(() => ({ unapproving: false }));
            })
    }

    changeFilter = (property) => {
        this.setState(() => ({
            property
        }), () => {
            this.getReport();
        });
    }

    getFilters = () => {
        var filters = {}, { employee, startDate, endDate, status } = this.state;

        if (employee)
            filters = { ...filters, idEmployee: employee };
        if (startDate)
            filters = { ...filters, startDate: moment(startDate).format("MM/DD/YYYY") };
        if (endDate)
            filters = { ...filters, endDate: moment(endDate).format("MM/DD/YYYY") };
        if (status)
            filters = { ...filters, status };

        return filters;
    }

    updateFilter = ({ employee, startDate, endDate, status }) => {
        this.setState((prevState) => ({
            employee,
            startDate,
            endDate,
            status
        }), () => {
            this.getReport();
        });
    }

    updateLoadingStatus = (status) => {
        this.setState(() => ({ loadingReport: status }))
    }

    updateData = (data) => {
        this.setState(() => ({ data }));
    }

    handleOpenModalDetails = (EmployeeId) => {
        let params = { EmployeeId };
        let { startDate, endDate } = this.state;

        if (startDate) params = { ...params, startDate: moment(startDate).format("MM/DD/YYYY") }
        if (endDate) params = { ...params, endDate: moment(endDate).format("MM/DD/YYYY") }

        this.props.client.query({
            query: GET_PUNCHES_REPORT_CONSOLIDATED,
            variables: { ...params }
        }).then(({ data: { markedEmployeesConsolidated } }) => {
            this.setState(() => {
                return {
                    modalDetailsData: markedEmployeesConsolidated,
                    openModalDetails: true
                }
            });
        });
    }

    handleCloseModalDetails = () => {
        this.setState({ openModalDetails: false });
    }

    handleOpenTimeModal = (item, allowEditModal) => {
        this.setState({ openTimeModal: true, timeModalData: item, editTimeModal: allowEditModal });
    };

    handleCloseTimeModal = () => {
        this.setState({ openTimeModal: false, timeModalData: {}, editTimeModal: false });
    };

    makeSelection = (status) => {
        let data = [...this.state.data];
        data.map(_ => {
            if (_.detailUnapproved.length > 0)
                _.selected = status;
        });
        this.setState(() => ({ data }));
    }

    render() {
        const { loadingReport, approving, unapproving, rowsId, startDate, endDate } = this.state;
        const loading = loadingReport;
        return <React.Fragment>
            {loading && <LinearProgress />}

            <div className="row">
                <div className="col-md-12">
                    <Filter {...this.state} updateFilter={this.updateFilter} updateLoadingStatus={this.updateLoadingStatus}
                        makeSelection={this.makeSelection} approveMarks={this.approveMarks} />
                    <Table data={this.state.data} approving={approving} unapproving={unapproving} approveMarks={this.approveMarks}
                        unapproveMarks={this.unapproveMarks} rowsId={rowsId} endDate={endDate} updateData={this.updateData} handleOpenModalDetails={this.handleOpenModalDetails} />

                    {/* Detalle de todas las marcadas de un empleado */}
                    <Dialog
                        fullWidth
                        maxWidth="md"
                        open={this.state.openModalDetails}
                    >
                        <DialogTitle id="customized-dialog-title" onClose={this.handleCloseModalDetails}>
                            &nbsp;
                        </DialogTitle>
                        <DialogContent style={{ overflow: 'visible' }}>
                            <h5 className="text-success mt-4">
                                {`Punches Report ${startDate ? `From: ${moment(startDate).format("MM/DD/YYYY")}` : ''} ${endDate ? `To: ${moment(endDate).format("MM/DD/YYYY")}` : ''}`}
                            </h5>
                            <div className="card" style={{ position: 'relative' }}>
                                <DropDown data={this.state.modalDetailsData} handleEditModal={this.handleOpenTimeModal}></DropDown>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Detalle de una marcada */}
                    <TimeCardForm
                        openModal={this.state.openTimeModal}
                        handleOpenSnackbar={this.props.handleOpenSnackbar}
                        onEditHandler={() => { }}
                        toggleRefresh={() => { }}
                        handleCloseModal={this.handleCloseTimeModal}
                        item={this.state.timeModalData}
                        readOnly={!this.state.editTimeModal}
                    />
                </div>
            </div>
        </React.Fragment>
    }
}

export default withApollo(withGlobalContent(ApprovePunchesReport));