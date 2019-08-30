import React, { Component, Fragment } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

class modalStart extends Component {
    state = {
        selectLanguage: false,
        displayLanguage: 'US'
    }

    showLanguageSelector = () => {
        this.setState(() => {
            return { selectLanguage: true }
        });
    }

    handleSelectLanguage = (e, lang) => {
        e.preventDefault();
        this.props.handleClose(lang);
    }

    render () {
        let {open} = this.props;
        return (
            <Fragment>
                <Dialog open={open} maxWidth="md" disableBackdropClick={true} >
                    <DialogTitle>
                        <h4 className="text-center"> Welcome </h4>
                    </DialogTitle>
                    <DialogContent>
                        {
                            this.state.selectLanguage
                                ?  (
                                    <Fragment>
                                        <h4>Select the language of your preference</h4>
                                        <div className="row justify-content-center">
                                            <div className="col-auto text-center p-4">
                                                <a href="custom" onClick={e => this.handleSelectLanguage(e, "US")}>
                                                    <img src="../../../../images/flags/united-states.png" style={{height: '50px', width: '50px'}} />
                                                    <h5>English</h5>
                                                </a>
                                            </div>
                                            <div className="col-auto text-center p-4" role="button">
                                                <a href="custom" onClick={e => this.handleSelectLanguage(e, "ES")}>
                                                    <img src="../../../../images/flags/spain.png" style={{height: '50px', width: '50px'}} />
                                                    <h5>Español</h5>
                                                </a>
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                                
                                : null
                                
                        }
                        { !this.state.selectLanguage && 
                            <DialogActions>
                                <button className="btn btn-primary btn-lg mx-auto m-2" type="button" onClick={this.showLanguageSelector}>
                                    <span className="display-4">Start</span>
                                </button>
                            </DialogActions>
                        }
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

export default modalStart;