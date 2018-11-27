import React, {Component} from 'react';
import InputMask from "react-input-mask";
import green from "@material-ui/core/colors/green";
import Tooltip from '@material-ui/core/Tooltip';
import InputForm from 'ui-components/InputForm/InputForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import 'ui-components/InputForm/index.css';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import './index.css';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px',
        width: '100%'
    },
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    formControl: {
        margin: theme.spacing.unit
        //width: '100px'
    },
    numberControl: {
        //width: '200px'
    },
    nameControl: {
        //width: '100px'
    },
    emailControl: {
        //width: '200px'
    },
    comboControl: {
        //width: '200px'
    },
    resize: {
        //width: '200px'
    },
    divStyle: {
        width: '95%',
        display: 'flex',
        justifyContent: 'space-around'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700]
        }
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
});

class ContactModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false
        }
    }

    handleClickOpenModal = () => {
        this.setState({openModal: true});
    };

    handleCloseModal = () => {
        this.setState({openModal: false});
    };

    render() {
        const {classes} = this.props;
        const {fullScreen} = this.props;

        return (
            <Dialog
                fullScreen={false}
                open={true}
                onClose={this.cancelContactHandler}
                aria-labelledby="responsive-dialog-title"
                maxWidth="lg"
            >
                <DialogTitle style={{padding: '0px'}}>
                    <div className="modal-header">
                        <h5 class="modal-title">
                            {' '}
                            {this.state.idToEdit != null &&
                            this.state.idToEdit != '' &&
                            this.state.idToEdit != 0 ? (
                                'Edit  Contact'
                            ) : (
                                'Create Contact'
                            )}
                        </h5>
                    </div>
                </DialogTitle>
                <DialogContent style={{minWidth: 600, padding: '0px'}}>
                    <div className="container">
                        <div className="">
                            <div className="row">
                                <div className="col-md-12 col-lg-6">
                                    <label>* Contact Type</label>
                                    <SelectForm
                                        id="type"
                                        name="type"
                                        data={this.state.contactTypes}
                                        update={this.updateType}
                                        showNone={false}
                                        //noneName="Employee"
                                        error={!this.state.typeValid}
                                        value={this.state.type}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-6">
                                    <label>* Department</label>
                                    <AutosuggestInput
                                        id="department"
                                        name="department"
                                        data={this.state.departments}
                                        error={!this.state.departmentNameValid}
                                        value={this.state.departmentName}
                                        onChange={this.updateDepartmentName}
                                        onSelect={this.updateDepartmentName}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* First Name</label>
                                    <InputForm
                                        id="firstname"
                                        name="firstname"
                                        maxLength="15"
                                        value={this.state.firstname}
                                        error={!this.state.firstnameValid}
                                        change={(value) => this.onFirstNameChangeHandler(value)}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>Middle Name</label>
                                    <InputForm
                                        id="middlename"
                                        name="middlename"
                                        maxLength="15"
                                        //error={!this.state.middlenameValid}
                                        value={this.state.middlename}
                                        change={(value) => this.onMiddleNameChangeHandler(value)}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* Last Name</label>
                                    <InputForm
                                        id="lastname"
                                        name="lastname"
                                        maxLength="20"
                                        error={!this.state.lastnameValid}
                                        value={this.state.lastname}
                                        change={(value) => this.onLastNameChangeHandler(value)}
                                    />
                                </div>

                                <div className="col-md-12 col-lg-4">
                                    <label>* Email</label>
                                    <InputForm
                                        id="email"
                                        name="email"
                                        maxLength="50"
                                        error={!this.state.emailValid}
                                        value={this.state.email}
                                        change={(value) => this.onEmailChangeHandler(value)}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* Phone Number</label>
                                    <InputMask
                                        id="number"
                                        name="number"
                                        mask="+(999) 999-9999"
                                        maskChar=" "
                                        value={this.state.number}
                                        className={
                                            this.state.numberValid ? 'form-control' : 'form-control _invalid'
                                        }
                                        onChange={(e) => {
                                            this.onNumberChangeHandler(e.target.value);
                                        }}
                                        placeholder="+(999) 999-9999"
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* Contact Title</label>
                                    <AutosuggestInput
                                        id="title"
                                        name="title"
                                        data={this.state.titles}
                                        error={!this.state.titleNameValid}
                                        value={this.state.titleName}
                                        onChange={this.updateTitleName}
                                        onSelect={this.updateTitleName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions style={{margin: '20px 20px'}}>
                    <div>
                        <div>
                            <Tooltip
                                title={
                                    this.state.idToEdit != null &&
                                    this.state.idToEdit != '' &&
                                    this.state.idToEdit != 0 ? (
                                        'Save Changes'
                                    ) : (
                                        'Insert Record'
                                    )
                                }
                            >
                                <div>
                                    <button
                                        // disabled={isLoading || !this.Login.AllowEdit || !this.Login.AllowInsert}
                                        variant="fab"
                                        className="btn btn-success"
                                        onClick={this.addContactHandler}
                                    >
                                        Save {!this.state.saving && <i class="fas fa-save"/>}
                                        {this.state.saving && <i class="fas fa-spinner fa-spin"/>}
                                    </button>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Tooltip title={'Cancel Operation'}>
                                <div>
                                    <button
                                        //disabled={this.state.loading || !this.state.enableCancelButton}
                                        variant="fab"
                                        className="btn btn-danger"
                                        onClick={this.cancelContactHandler}
                                    >
                                        Cancel <i class="fas fa-ban"/>
                                    </button>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

ContactModal.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default ContactModal;