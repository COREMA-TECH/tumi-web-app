import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

class CardTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirm: false
        }
    }

    handleCloseConfirmDialog = () => {
        this.setState(() => { return { showConfirm: false } })
    }

    showConfirmDialog = () => {
        this.setState(() => { return { showConfirm: true } })
    }

    printDialogConfirm = () => {
        return <Dialog maxWidth="sm" open={this.state.showConfirm} onClose={this.handleCloseConfirmDialog}>
            <DialogContent>
                <h2>Do you want convert this Work Order to Opening?</h2>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-success btn-not-rounded mr-1" type="button">
                    Convert whole Work Order
            </button>
                <button className="btn btn-default btn-not-rounded" type="button">
                    Convert this Record
            </button>
                <button className="btn btn-danger btn-not-rounded mr-1" type="button" onClick={this.handleCloseConfirmDialog}>
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
            {this.printDialogConfirm()}
        </div>
    }
}
export default CardTemplate;
