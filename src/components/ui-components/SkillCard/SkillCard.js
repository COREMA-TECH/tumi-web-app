import React, {Component} from 'react';
import './index.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";


const spanishActions = require(`../../ApplyForm/Application/languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);


class SkillCard extends Component {
    constructor(props) {
        super();

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
                        {spanishActions[2].label}
                    </button>
                    <button
                        className="applicant-card__save-button"
                        onClick={() => {
                            this.props.removeSkill()
                        }}>
                        {spanishActions[3].label}
                    </button>
                </DialogActions>
            </Dialog>
        );

        return (
            <div className="skill-card">
                <span
                    className="skill-card__remove-button"
                    onClick={() => {
                        this.handleClickOpen();
                    }}
                >
                    <i className="fas fa-trash-alt"></i>
                </span>
                <div className="skill-card__description applicant-card__label ">{this.props.skillDescription}</div>
                <div className="skill-card__level">{this.props.skillLevel}</div>

                {
                    renderQuestionDialog()
                }
            </div>
        );
    }
}

export default SkillCard;