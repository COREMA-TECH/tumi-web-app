import React, { Component } from 'react';
import Content from './Content';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import PropTypes from 'prop-types';

const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class IndependentContractModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasSign: false
        }
    }

    setSignStatus = (hasSign) => {
        this.setState(() => ({ hasSign }))
    }



    handleIndependenContractSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.onHandleSave(this.state.hasSign);
    }

    render() {
        return <Dialog maxWidth="md" open={this.props.open} onClose={this.props.handleVisibility(false)}>

            <form id="independentContractForm" onSubmit={this.handleIndependenContractSubmit}>
                <DialogTitle>
                    <h5 className="modal-title">INDEPENDENT CONTRACT</h5>
                </DialogTitle>
                <DialogContent>
                    <Content setSignStatus={this.setSignStatus} />
                </DialogContent>
                <DialogActions>
                    <div className="applicant-card__footer">
                        <button
                            className="applicant-card__cancel-button"
                            onClick={this.props.handleVisibility(false)}
                        >
                            {spanishActions[2].label}
                        </button>
                        <button type="submit" className="applicant-card__save-button" > Accept </button>

                    </div>
                </DialogActions>

            </form>
        </Dialog>

    }
}

IndependentContractModal.propTypes = {
    open: PropTypes.object.isRequired,
    handleVisibility: PropTypes.func.isRequired,
    onHandleSave: PropTypes.func.isRequired
};

export default IndependentContractModal;