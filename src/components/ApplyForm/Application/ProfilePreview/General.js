import React, {Component} from 'react';
import './preview-profile.css';
import './../index.css';
import withApollo from "react-apollo/withApollo";
import {GET_APPLICATION_PROFILE_INFO} from "./Queries";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import ContactModal from "../../../Contact/ContactModal";
import InputMask from "react-input-mask";
import green from "@material-ui/core/colors/green";
import Tooltip from '@material-ui/core/Tooltip';
import InputForm from 'ui-components/InputForm/InputForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";
import {INSERT_CONTACT} from "./Mutations";
import ContactTypesData from '../../../../data/contactTypes';
import withGlobalContent from "../../../Generic/Global";


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

class General extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: false,
            error: false,
            data: [],
            openModal: false,


            // Modal state
            contactTypes: ContactTypesData
        }
    }

    handleClickOpenModal = () => {
        this.setState({openModal: true});
    };

    handleCloseModal = () => {
        this.setState({openModal: false});
    };

    /**
     * To get the profile information for applicant
     * @param id
     */
    getProfileInformation = (id) => {
        this.props.client
            .query({
                query: GET_APPLICATION_PROFILE_INFO,
                variables: {
                    id: id
                }
            })
            .then(({data}) => {
                this.setState({
                    data: data.applications[0]
                }, () => {
                    this.setState({
                        loading: false
                    })
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: true
                })
            })
    };

    componentWillMount(){
        this.setState({
            loading: true
        }, () => {
            this.getProfileInformation(this.props.applicationId);
        })
    }

    render() {
        const {classes} = this.props;
        const {fullScreen} = this.props;


        if (this.state.loading) {
            return <LinearProgress />
        }


        if (this.state.error) {
            return <LinearProgress />
        }

        let renderDialog = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                aria-labelledby="responsive-dialog-title"
                maxWidth="lg"
            >
                <DialogTitle style={{ padding: '0px' }}>
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
                <DialogContent style={{ minWidth: 600, padding: '0px' }}>
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
                                    {/*<AutosuggestInput*/}
                                    {/*id="department"*/}
                                    {/*name="department"*/}
                                    {/*data={this.state.departments}*/}
                                    {/*error={!this.state.departmentNameValid}*/}
                                    {/*value={this.state.departmentName}*/}
                                    {/*onChange={this.updateDepartmentName}*/}
                                    {/*onSelect={this.updateDepartmentName}*/}
                                    {/*/>*/}
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
                                    {/*<AutosuggestInput*/}
                                    {/*id="title"*/}
                                    {/*name="title"*/}
                                    {/*data={this.state.titles}*/}
                                    {/*error={!this.state.titleNameValid}*/}
                                    {/*value={this.state.titleName}*/}
                                    {/*onChange={this.updateTitleName}*/}
                                    {/*onSelect={this.updateTitleName}*/}
                                    {/*/>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions style={{ margin: '20px 20px' }}>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
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
                                        Save {!this.state.saving && <i class="fas fa-save" />}
                                        {this.state.saving && <i class="fas fa-spinner fa-spin" />}
                                    </button>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <Tooltip title={'Cancel Operation'}>
                                <div>
                                    <button
                                        //disabled={this.state.loading || !this.state.enableCancelButton}
                                        variant="fab"
                                        className="btn btn-danger"
                                        onClick={this.handleCloseModal}
                                    >
                                        Cancel <i class="fas fa-ban" />
                                    </button>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        );

        return (
            <div className="Apply-container--application">
                <div className="">
                    <div className="">
                        <div className="applicant-card">
                            <div className="row">
                                <div className="item col-sm-12 col-md-3">
                                    <div className="row">
                                        <span className="username col-sm-12">{this.state.data.firstName + ' ' + this.state.data.lastName}</span>
                                        <span className="username-number col-sm-12">Emp #: TM-0000{this.state.data.id}</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12 col-md-2">
                                    <div className="row">
                                        <span className="col-sm-6 col-lg-12">Title: {this.state.data.position.Name.trim()}</span>
                                        <span className="col-sm-6 col-lg-12">Department: Banquet</span>
                                    </div>
                                </div>
                                <div className="item col-6 col-md-2">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Schedule Type</span>
                                        <span className="col-sm-12">Text</span>
                                    </div>
                                </div>
                                <div className="item col-6 col-md-2">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Payroll Preference</span>
                                        <span className="col-sm-12">Text</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12  col-md-1">
                                    <div className="row">
                                        <span className="col-12 col-md-12 font-weight-bold">Active</span>
                                        <div className="col-12 col-md-12">
                                            <label className="switch">
                                                <input
                                                    id="vehicleReportRequired"
                                                    type="checkbox"
                                                    className="form-control"
                                                    min="0"
                                                    maxLength="50"
                                                    minLength="10"
                                                    form="background-check-form"
                                                    checked={this.state.data.isActive}
                                                />
                                                <p className="slider round"></p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="item col-sm-12  col-md-2">
                                    <button className="btn btn-info" onClick={() => {
                                        this.handleClickOpenModal();
                                    }}>Create Profile</button>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="applicant-card general-table-container">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First</th>
                                        <th scope="col">Last</th>
                                        <th scope="col">Handle</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">3</th>
                                        <td>Larry</td>
                                        <td>the Bird</td>
                                        <td>@twitter</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <br/>
                            <br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5>Titles</h5>
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Banquet
                                            Server
                                        </div>
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Banquet
                                            Server
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5>Location able to work</h5>
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">WJ
                                            Marriot
                                        </div>
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Downtown
                                            Doubletree
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    renderDialog()
                }
            </div>
        );
    }
}


General.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default withGlobalContent(withStyles(styles)(withApollo(withMobileDialog()(General))));
