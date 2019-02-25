import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { CONVERT_TO_OPENING } from './Mutations';
import withApollo from 'react-apollo/withApollo';

const ONE_ITEM_MESSAGE_OPENING = "Send ONLY this item", ALL_ITEM_MESSAGE_OPENING = "Send All Items on this Work Order"
const ONE_ITEM_MESSAGE_WORK_ORDER = "Recall Only this Item", ALL_ITEM_MESSAGE_WORK_ORDER = "Recall All Items on this Work Order"


class CardTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmToOpening: false,
            showConfirmToWorkOrder: false,
            showCancelWorkOrder: false,
            convertingOneItem: false,
            convertingAllItems: false,

            currentStatus: props.isOpening,
            prevStatus: props.isOpening
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpening != this.props.isOpening)
            this.setState(() => {
                return {
                    currentStatus: nextProps.isOpening,
                    prevStatus: nextProps.isOpening
                }
            })
    }

    //This is for Opening
    handleCloseConfirmDialogToOpening = () => {
        this.setState((prevState) => { return { showConfirmToOpening: false, currentStatus: prevState.prevStatus } })
    }

    handleConvertAllItemToOpening = ({ WorkOrderId }) => {
        this.convertToOpeningOrWorkOrder({ shiftWorkOrder: { WorkOrderId }, sourceStatus: 1, targetStatus: 2 }, ALL_ITEM_MESSAGE_OPENING, this.updateProgressAllItems)
    }

    handleConvertThisItemToOpening = ({ id }) => {
        this.convertToOpeningOrWorkOrder({ shift: { id }, sourceStatus: 1, targetStatus: 2 }, ONE_ITEM_MESSAGE_OPENING, this.updateProgressOneItem)
    }
    //-------------------------------------

    //Tthis is for Work Order
    handleCloseConfirmDialogToWorkOrder = () => {
        this.setState((prevState) => { return { showConfirmToWorkOrder: false, currentStatus: prevState.prevStatus } })
    }

    handleCloseConfirmDialogCancelToWorkOrder = () => {
        this.setState((prevState) => { return { showCancelWorkOrder: false, currentStatus: prevState.prevStatus } })
    }

    handleConvertAllItemToWorkOrder = ({ WorkOrderId }) => {
        this.convertToOpeningOrWorkOrder({ shiftWorkOrder: { WorkOrderId }, sourceStatus: 2, targetStatus: 1 }, ALL_ITEM_MESSAGE_WORK_ORDER, this.updateProgressAllItems)
    }

    handleConvertThisItemToWorkOrder = ({ id }) => {
        this.convertToOpeningOrWorkOrder({ shift: { id }, sourceStatus: 2, targetStatus: 1 }, ONE_ITEM_MESSAGE_WORK_ORDER, this.updateProgressOneItem)
    }

    handleCancelAllItemToWorkOrder = ({ WorkOrderId }) => {
        this.convertToOpeningOrWorkOrder({ shiftWorkOrder: { WorkOrderId }, sourceStatus: 1, targetStatus: 0 }, "Cancel All Items on this Work Order", this.updateProgressAllItems)
    }

    handleCancelThisItemToWorkOrder = ({ id }) => {
        this.convertToOpeningOrWorkOrder({ shift: { id }, sourceStatus: 1, targetStatus: 0 }, "Cancel Only this Item", this.updateProgressOneItem)
    }

    //-----------------------------------------------

    updateProgressAllItems = (status) => {
        this.setState(() => { return { convertingAllItems: status } })
    }

    updateProgressOneItem = (status) => {
        this.setState(() => { return { convertingOneItem: status } })
    }

    convertToOpeningOrWorkOrder = (args, message, fncUpdateProgress) => {
        fncUpdateProgress(true);
        this.props.client
            .mutate({
                mutation: CONVERT_TO_OPENING,
                variables: { ...args }
            })
            .then(({ data }) => {
                this.props.handleOpenSnackbar('success', `${message} successful`, 'bottom', 'right');
                fncUpdateProgress(false);
                this.setState(() => { return { showConfirmToOpening: false, showConfirmToWorkOrder: false, showCancelWorkOrder: false } }, () => {
                    this.props.getWorkOrders();
                })

            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    `Error to with operation [${message}]. Please, try again!`,
                    'bottom',
                    'right'
                );
                fncUpdateProgress(false);
            });
    }


    printDialogConfirmConvertToOpening = ({ id, WorkOrderId }) => {
        return <Dialog maxWidth="xl" open={this.state.showConfirmToOpening} onClose={this.handleCloseConfirmDialogToOpening}>
            <DialogContent>
                <h2 className="text-center">Send Work Order to a recruiter</h2>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-success  btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={() => this.handleConvertAllItemToOpening({ WorkOrderId })}>
                    {ALL_ITEM_MESSAGE_OPENING}{this.state.convertingAllItems && <i className="fas fa-spinner fa-spin ml-1" />}
                </button>
                <button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={() => this.handleConvertThisItemToOpening({ id })}>
                    {ONE_ITEM_MESSAGE_OPENING}{this.state.convertingOneItem && <i className="fas fa-spinner fa-spin ml-1" />}
                </button>
                <button className="btn btn-danger btn-not-rounded mr-2 mb-2" type="button" onClick={this.handleCloseConfirmDialogToOpening}>
                    Cancel
            </button>
            </DialogActions>
        </Dialog>
    }

    printDialogConfirmConvertToWO = ({ id, WorkOrderId }) => {

        return <Dialog maxWidth="xl" open={this.state.showConfirmToWorkOrder} onClose={this.handleCloseConfirmDialogToWorkOrder}>
            <DialogContent>
                <h2 className="text-center">Recall Work Order From Recruiting</h2>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-success  btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={() => this.handleConvertAllItemToWorkOrder({ WorkOrderId })}>
                    {ALL_ITEM_MESSAGE_WORK_ORDER}{this.state.convertingAllItems && <i class="fas fa-spinner fa-spin ml-1" />}
                </button>
                <button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={() => this.handleConvertThisItemToWorkOrder({ id })}>
                    {ONE_ITEM_MESSAGE_WORK_ORDER}{this.state.convertingOneItem && <i class="fas fa-spinner fa-spin ml-1" />}
                </button>
                <button className="btn btn-danger btn-not-rounded mr-2 mb-2" type="button" onClick={this.handleCloseConfirmDialogToWorkOrder}>
                    Cancel
            </button>
            </DialogActions>
        </Dialog>
    }


    printDialogCancelWO = ({ id, WorkOrderId }) => {
        return <Dialog maxWidth="xl" open={this.state.showCancelWorkOrder} onClose={this.handleCloseConfirmDialogCancelToWorkOrder}>
            <DialogContent>
                <h2 className="text-center">Cancel Work Order?</h2>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-success  btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={() => this.handleCancelAllItemToWorkOrder({ WorkOrderId })}>
                    Cancel All Items on this Work Order {this.state.convertingAllItems && <i class="fas fa-spinner fa-spin ml-1" />}
                </button>
                <button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={() => this.handleCancelThisItemToWorkOrder({ id })}>
                    Cancel Only this Item {this.state.convertingOneItem && <i class="fas fa-spinner fa-spin ml-1" />}
                </button>
                <button className="btn btn-danger btn-not-rounded mr-2 mb-2" type="button" onClick={this.handleCloseConfirmDialogCancelToWorkOrder}>
                    Cancel
              </button>
            </DialogActions>
        </Dialog>
    }

    printButtons = ({ id, laneId }) => {
        if (laneId == "lane1")
            return <div className="onoffswitch mb-1 board-switch" style={{ marginLeft: "auto" }} >
                <input
                    id={`chkConvert${id}`}
                    className="onoffswitch-checkbox"
                    onChange={this.handleCheckedChange}
                    checked={this.state.currentStatus}
                    type="checkbox"
                />
                <label className="onoffswitch-label" htmlFor={`chkConvert${id}`}>
                    <span className="onoffswitch-inner" />
                    <span className="onoffswitch-switch" />
                </label>
            </div>
    }

    handleCheckedChange = (event) => {
        const target = event.target;
        this.setState((prevState) => {
            return {
                currentStatus: target.checked,
                prevStatus: prevState.currentStatus,
                showConfirmToOpening: target.checked,
                showConfirmToWorkOrder: !target.checked
            }
        });
    };

    goToEmployeePackage = (id) => {
        // window.location.href = '/employment-application';

        //FIXME: can't go back using this function
        this.props.history.push({
            pathname: '/home/application/info',
            state: { ApplicationId: id }
        });
    };

    showTitle = () => {
        if (this.props.laneId === "Interview")
            return <React.Fragment>
                <div
                    title="View Application"
                    className="interview-title ml-1"
                    style={{ margin: 2, fontSize: 14, fontWeight: 'bold', color: this.props.Status == 0 ? '#808080' : '#3CA2C8' }}
                    onClick={() => this.goToEmployeePackage(this.props.id)}
                >
                    {this.props.name}
                </div>
                {/*<i className={["fas fa-circle", "ml-auto", this.props.statusCompleted ? "text-info" : "text-danger"].join(" ")} style={{ marginTop: '7px', fontSize: '10px' }}></i>*/}
                <i className={["fas fa-pen", "ml-auto", this.props.statusCompleted ? "text-info" : "text-danger"].join(" ")} style={{ marginTop: '7px', fontSize: '10px' }}></i>
            </React.Fragment>
        else if (this.props.laneId === "lane1") { return <div style={{ margin: 2, fontSize: 14, fontWeight: 'bold', color: this.props.Status == 0 ? '#808080' : '#3CA2C8' }}><i onClick={() => { this.setState({ showCancelWorkOrder: true }) }} style={{ margin: 2, fontSize: 14, fontWeight: 'bold', color: this.props.Status == 0 ? '#808080' : '#c83c3c' }} className="fas fa-ban"></i> {this.props.name}</div> }
        else return <div style={{ margin: 2, fontSize: 14, fontWeight: 'bold', color: this.props.Status == 0 ? '#808080' : '#3CA2C8' }}>{this.props.name}</div>
    }

    render() {
        return <div>
            <header
                style={{
                    borderBottom: '1px solid #eee',
                    paddingBottom: 0,
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    color: this.props.Status == 0 ? '#808080' : '#4C4C4C'
                }}>
                {this.showTitle()}
                <div style={{ margin: 2, fontWeight: 'bold', fontSize: 12 }}>{this.props.dueOn}</div>
            </header>
            <div style={{ fontSize: 12, color: this.props.Status == 0 ? '#808080' : '#4C4C4C' }}>
                <div style={{ margin: 2, color: this.props.Status == 0 ? '#808080' : '#4C4C4C', fontWeight: 'bold' }}>{this.props.subTitle}</div>
                <div style={{ margin: 5, padding: '0px 0px' }}><i>{this.props.body}</i>
                </div>
                <header
                    style={{
                        paddingBottom: 0,
                        marginBottom: 0,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        color: this.props.cardColor
                    }}>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{this.props.escalationTextLeft}</div>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{this.props.escalationTextCenter}</div>
                    <div style={{ margin: 1, fontWeight: 'bold', fontSize: 12 }}>{this.props.escalationTextRight}  </div>
                </header>
                <header
                    style={{
                        paddingBottom: 0,
                        marginBottom: 0,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        color: this.props.cardColor
                    }}>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{this.props.escalationTextLeftLead}</div>
                    <div style={{ margin: 1, fontSize: 12, fontWeight: 'bold' }}>{this.props.escalationTextCenterLead}</div>
                    {this.props.escalationTextRightLead && <div style={{ margin: 1, fontWeight: 'bold', fontSize: 12 }}><i class="fas fa-car-side"></i>{this.props.escalationTextRightLead}  </div>}
                </header>
                <right>
                    {this.printButtons(this.props)}
                </right>
            </div>
            {this.printDialogConfirmConvertToOpening(this.props)}
            {this.printDialogConfirmConvertToWO(this.props)}
            {this.printDialogCancelWO(this.props)}
        </div>
    }
}
export default withApollo(CardTemplate);