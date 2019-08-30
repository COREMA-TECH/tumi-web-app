import React, { Component } from 'react';
import './index.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

const spanishActions = require(`../../ApplyForm/Application/languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const dialogMessages = require(`../../ApplyForm/Application/languagesJSON/${localStorage.getItem('languageForm')}/dialogMessages`);


class EducationCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    // To open the skill dialog
    handleClickOpen = () => {
        this.setState({ open: true });
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
                    {dialogMessages[0].label}
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <button className="applicant-card__cancel-button" onClick={this.handleClose}>
                        {spanishActions[2].label}
                    </button>
                    <button
                        className="applicant-card__save-button"
                        onClick={() => {
                            this.props.remove()
                        }}>
                        {spanishActions[3].label}
                    </button>
                </DialogActions>
            </Dialog>
        );

        return (
            <div className="education-card">
                <span
                    className="education-card__remove-button"
                    onClick={() => {
                        this.handleClickOpen();
                    }}>
                    <i className="fas fa-trash-alt"></i>
                </span>
                <span
                    className="education-card__edit-button"
                    onClick={() => {
                        this.props.handleOpenModal();
                    }}>
                    <i className="fas fa-pen"></i>
                </span>
                <div className="education-card__job-title">{this.props.type}</div>
                <div className="education-card__company" title="Institution">
                    <i className="fas fa-university"></i><span> {this.props.educationName}</span>
                </div>
                <div className="education-card__address" title="Address">
                    <i className="fas fa-map-marker-alt"></i><span> {this.props.address}</span>
                </div>
                <div className="education-card__phone" title="Start Date">
                    <i className="far fa-calendar-alt"></i><span>{this.props.startDate ? this.props.startDate.substring(0, 10) : ''}</span>
                </div>
                <div className="education-card__phone" title="End Date">
                    <i className="far fa-calendar-check"></i><span>{this.props.endDate ? this.props.endDate.substring(0, 10) : ''}</span>
                </div>
                <div className="education-card__phone" title="Graduated">
                    <i className="fas fa-graduation-cap"></i><span>{this.props.graduated ? 'Yes' : 'No'}</span>
                </div>
                {
                    this.props.degree === undefined ? (
                        <div className="education-card__phone" title="Degree">
                            <i className="far fa-file-alt"></i><span>{this.props.degree}</span>
                        </div>
                    ) : (
                            ''
                        )
                }

                {
                    renderQuestionDialog()
                }
            </div>
        );
    }
}

export default EducationCard;