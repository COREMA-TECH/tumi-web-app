import React, {Component} from 'react';
import './index.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

class PreviousEmploymentCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    // To open the skill dialog
    handleClickOpen = () => {
        this.setState({open: true});
    };

    // To close the skill dialog
    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        let renderQuestionDialog = () => (
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>
                    Are you sure you want to delete the record?
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <button className="applicant-card__cancel-button" onClick={this.handleClose}>
                        Cancel
                    </button>
                    <button
                        className="applicant-card__save-button"
                        onClick={() => {
                            this.props.remove()
                        }}>
                        Delete
                    </button>
                </DialogActions>
            </Dialog>
        );

        return (
            <div className="previous-employment-card">
                <span
                    className="previous-employment-card__remove-button"
                    onClick={() => {
                        this.handleClickOpen();
                    }}>
                    <i className="fas fa-trash-alt"></i>
                </span>
                <div className="previous-employment-card__job-title applicant-card__label">{this.props.jobTitle}</div>
                <div className="previous-employment-card__company">
                    <i className="fas fa-building"></i><span> {this.props.company}</span>
                </div>
                <div className="previous-employment-card__address">
                    <i className="fas fa-map-marker-alt"></i><span> {this.props.address}</span>
                </div>
                <div className="previous-employment-card__phone">
                    <i className="fas fa-phone"></i><span> {this.props.phone}</span>
                </div>
                <div className="previous-employment-card__phone">
                    <i className="far fa-calendar-alt"></i><span>{this.props.startDate.substring(0, 10)}</span>
                </div>
                <div className="previous-employment-card__phone">
                    <i className="far fa-calendar-check"></i><span>{this.props.endDate.substring(0, 10)}</span>
                </div>

                {
                    renderQuestionDialog()
                }
            </div>
        );
    }
}

export default PreviousEmploymentCard;