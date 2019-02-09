import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { CONVERT_TO_OPENING } from './Mutations';
import withApollo from 'react-apollo/withApollo';

const ONE_ITEM_MESSAGE = "Send ONLY this item", ALL_ITEM_MESSAGE = "Send All Items on this Work Order"

class CardTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirm: false,
            convertingOneItem: false,
            convertingAllItems: false
        }
    }


    handleCloseConfirmDialog = () => {
        this.setState(() => { return { showConfirm: false } })
    }

    showConfirmDialog = () => {
        this.setState(() => { return { showConfirm: true } })
    }

    handleConvertAllItem = ({ WorkOrderId }) => {
        this.convertToOpening({ shiftWorkOrder: { WorkOrderId } }, ALL_ITEM_MESSAGE, this.updateProgressAllItems)
    }

    handleConvertThisItem = ({ id }) => {
        this.convertToOpening({ shift: { id } }, ONE_ITEM_MESSAGE, this.updateProgressOneItem)
    }

    updateProgressAllItems = (status) => {
        this.setState(() => { return { convertingAllItems: status } })
    }
    updateProgressOneItem = (status) => {
        this.setState(() => { return { convertingOneItem: status } })
    }
    convertToOpening = (args, message, fncUpdateProgress) => {
        fncUpdateProgress(true);
        this.props.client
            .mutate({
                mutation: CONVERT_TO_OPENING,
                variables: { ...args }
            })
            .then(({ data }) => {
                this.props.handleOpenSnackbar('success', `${message} successful`, 'bottom', 'right');
                fncUpdateProgress(false);
                this.setState(() => { return { showConfirm: false } }, () => {
                    this.props.getWorkOrders("Esto es desde Card Template");
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


    printDialogConfirm = ({ id, WorkOrderId }) => {
        return <Dialog maxWidth="sm" open={this.state.showConfirm} onClose={this.handleCloseConfirmDialog}>
            <DialogContent>
                <h2 className="text-center">Send Work Order to a recruiter</h2>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-success btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={() => this.handleConvertAllItem({ WorkOrderId })}>
                    {ALL_ITEM_MESSAGE}{this.state.convertingAllItems && <i class="fas fa-spinner fa-spin ml-1" />}
                </button>
                <button className="btn btn-info btn-not-rounded mb-2" type="button" onClick={() => this.handleConvertThisItem({ id })}>
                    {ONE_ITEM_MESSAGE}{this.state.convertingOneItem && <i class="fas fa-spinner fa-spin ml-1" />}
                </button>
                <button className="btn btn-danger btn-not-rounded mr-2 mb-2" type="button" onClick={this.handleCloseConfirmDialog}>
                    Cancel
            </button>
            </DialogActions>
        </Dialog>
    }

    printButtons = ({ laneId }) => {
        if (laneId == "lane1")
            return <button
                className="btn btn-info"
                title="Convert to opening"
                onClick={this.showConfirmDialog}
                type="button"
            >
                <i class="fas fa-sync-alt"></i>
            </button>
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
                    color: this.props.cardColor
                }}>
                <div style={{ margin: 2, fontSize: 14, fontWeight: 'bold', color: '#3CA2C8' }}>{this.props.name}</div>
                <div style={{ margin: 2, fontWeight: 'bold', fontSize: 12 }}>{this.props.dueOn}</div>
            </header>
            <div style={{ fontSize: 12, color: '#4C4C4C' }}>
                <div style={{ margin: 2, color: '#4C4C4C', fontWeight: 'bold' }}>{this.props.subTitle}</div>
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
                {this.printButtons(this.props)}
            </div>
            {this.printDialogConfirm(this.props)}
        </div>
    }
}
export default withApollo(CardTemplate);
