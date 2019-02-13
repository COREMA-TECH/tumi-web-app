import React, {Component} from 'react';
import './index.css';
import withApollo from "react-apollo/withApollo";
import {ADD_BACKGROUND_CHECK, UPDATE_BACKGROUND_CHECK} from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import {GET_STATES_QUERY} from "../../Queries";
import SelectNothingToDisplay
    from "../../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";
import Query from "react-apollo/Query";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import CircularProgressLoading from "../../../material-ui/CircularProgressLoading";
import {GET_APPLICATION_CHECK_ID} from "./Queries";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import renderHTML from "react-render-html";

const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const backgroundCheckJson = require(`../languagesJSON/${localStorage.getItem('languageForm')}/backgroundCheck`);
const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);

class BackgroundCheck extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            vehicleReportRequired: false,
            driverLicenseNumber: '',
            commercialDriverLicense: false,
            licenseState: null,
            licenseExpiration: null,
            accept: false,
            signature: '',

            // signature dialog state property
            openSignature: false,
            loading: false,

            // If the background check info exist show a edit button
            loadedBackgroundCheckById: false,
            editing: false
        }
    }

    /**
     * To get background check info using id
     */
    getBackgroundCheckById = (id) => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: GET_APPLICATION_CHECK_ID,
                    variables: {
                        id: id
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {

                    if (data.applications[0].backgroundCheck !== null) {
                        this.setState({
                            loading: false,
                            id: data.applications[0].backgroundCheck.id,
                            vehicleReportRequired: data.applications[0].backgroundCheck.vehicleReportRequired,
                            driverLicenseNumber: data.applications[0].backgroundCheck.driverLicenseNumber,
                            commercialDriverLicense: data.applications[0].backgroundCheck.commercialDriverLicense,
                            licenseState: data.applications[0].backgroundCheck.licenseState === null ? "" : data.applications[0].backgroundCheck.licenseState,
                            licenseExpiration: data.applications[0].backgroundCheck.licenseExpiration === null ? "" : data.applications[0].backgroundCheck.licenseExpiration.substring(0, 10),
                            signature: data.applications[0].backgroundCheck.signature,
                            date: data.applications[0].backgroundCheck.date.substring(0, 10),
                            loadedBackgroundCheckById: true,
                            editing: true,
                            accept: true
                        });
                    } else {
                        this.setState({
                            loading: false,
                        });
                    }
                })
                .catch(error => {
                    this.setState({
                        loading: false
                    });

                    // If there's an error show a snackbar with a error message
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to show background check information. Please, try again!',
                        'bottom',
                        'right'
                    );
                })
        })
    };

    insertBackgroundCheck = (item) => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .mutate({
                    mutation: ADD_BACKGROUND_CHECK,
                    variables: {
                        backgroundCheck: item
                    }
                })
                .then(data => {
                    //Reset the form
                    document.getElementById("background-check-form").reset();

                    this.setState({
                        accept: false,
                        signature: '',
                        loading: false,
                        editing: false
                    });

                    this.getBackgroundCheckById(this.props.applicationId);

                    // Show a snackbar with a success message
                    this.props.handleOpenSnackbar(
                        'success',
                        'Successfully created!',
                        'bottom',
                        'right'
                    );
                })
                .catch(error => {
                    // If there's an error show a snackbar with a error message
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to insert background check information. Please, try again!',
                        'bottom',
                        'right'
                    );

                    this.setState({
                        loading: false
                    });
                })
        });
    };

    /**
     * To UPDATE a background check by id
     * @param item with background check object
     */
    updateBackgroundCheck = (item) => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .mutate({
                    mutation: UPDATE_BACKGROUND_CHECK,
                    variables: {
                        backgroundCheck: item
                    }
                })
                .then(data => {
                    //Reset the form
                    document.getElementById("background-check-form").reset();

                    this.setState({
                        accept: false,
                        signature: '',
                        loading: false,
                        editing: false
                    });

                    this.getBackgroundCheckById(this.props.applicationId);

                    // Show a snackbar with a success message
                    this.props.handleOpenSnackbar(
                        'success',
                        'Successfully updated!',
                        'bottom',
                        'right'
                    );
                })
                .catch(error => {
                    // If there's an error show a snackbar with a error message
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to insert background check information. Please, try again!',
                        'bottom',
                        'right'
                    );

                    this.setState({
                        loading: false
                    });
                })
        });
    };

    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        // Get elements from background check
        let form = document.getElementById("background-check-form").elements;
        let backgroundCheckItem;

        // Build the object with form information
        if (form.item(0).checked) {
            backgroundCheckItem = {
                vehicleReportRequired: form.item(0).checked,
                driverLicenseNumber: form.item(1).value.trim(),
                commercialDriverLicense: form.item(4).checked,
                licenseState: form.item(2).value.trim(),
                licenseExpiration: form.item(3).value.trim(),
                signature: this.state.signature,

                // TODO: Fix this static fields
                content: "".trim(),
                date: new Date().toISOString(),
                applicantName: "".trim(),
                ApplicationId: this.props.applicationId
            };
        } else {
            backgroundCheckItem = {
                vehicleReportRequired: form.item(0).checked,
                driverLicenseNumber: "",
                commercialDriverLicense: false,
                licenseState: null,
                licenseExpiration: null,
                signature: this.state.signature,

                // TODO: Fix this static fields
                content: "".trim(),
                date: new Date().toISOString(),
                applicantName: "".trim(),
                ApplicationId: this.props.applicationId
            };
        }


        // To insert background check
        if (this.state.id === null) {
            this.insertBackgroundCheck(backgroundCheckItem);
        } else {
            backgroundCheckItem.id = this.state.id;
            console.table(backgroundCheckItem);
            this.updateBackgroundCheck(backgroundCheckItem);
        }
    };

    componentWillMount() {
        // FIXME: pass dynamic id
        this.getBackgroundCheckById(this.props.applicationId);
    }

    render() {
        const {fullScreen} = this.props;

        let renderSignatureDialog = () => (
            <div>
                {
                    this.state.accept ? (
                        <Dialog
                            open={this.state.openSignature}
                            fullWidth
                            onClose={() => {
                                this.setState({
                                    openSignature: false,
                                }, () => {
                                    if (this.state.signature === '') {
                                        this.setState({
                                            accept: false
                                        })
                                    }
                                })
                            }}
                            aria-labelledby="form-dialog-title">
                            <Toolbar>
                                <h1 className="primary apply-form-container__label">{backgroundCheckJson[6].label}</h1>
                                <Button color="default" onClick={() => {
                                    this.setState({
                                        openSignature: false,
                                    }, () => {
                                        if (this.state.signature === '') {
                                            this.setState({
                                                accept: false
                                            })
                                        }
                                    })
                                }}>
                                    Close
                                </Button>
                            </Toolbar>
                            <DialogContent>
                                <SignatureForm applicationId={this.state.applicationId}
                                               signatureValue={this.handleSignature}
                                               showSaveIcon={null}
                                />
                            </DialogContent>
                        </Dialog>
                    ) : (
                        ''
                    )
                }
            </div>
        );


        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-md-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[1].label}</span>
                                {
                                    this.state.editing ? (
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.setState({
                                                editing: false
                                            })
                                        }}>Edit <i className="far fa-edit"></i>
                                        </button>
                                    ) : (
                                        ''
                                    )
                                }
                            </div>
                            <div className="row">
                                <div className="col-md-8 offset-md-2">
                                    {renderHTML(`
                                            <p dir="ltr">In connection with my application for employment, I understand that an investigative background inquiry is to be made on myself, including, but no limited to, identity and prior address(es) verification, criminal history, driving record, consumer credit history, education verification, prior employment verification and other references as well as other information.</p>
                                            <br>
                                            <p dir="ltr">I further understand that for the purposes of this background inquiry, various sources will be contacted to provide information, including but not limited to various Federal, State, County, municipal, corporate, private and other agencies, which may maintain records concerning my past activities relating to my criminal conduct, civil court litigation, driving record, and credit performance, as well as various other experiences.</p>
                                            <br>
                                            <p dir="ltr">I hereby authorize without reservation, any company, agency, party of other source contracted to furnish the above information as requested. I do hereby release, discharge and indemnify the prospective employer, it&rsquo;s agents and associates to the full extent permitted by law from any claims, damages, losses, liabilities, cost and expenses arising from the retrieving and reporting of the requested information.</p>
                                            <br>
                                            <p dir="ltr">I acknowledge that a photocopy of this authorization be accepted with the same authority as the original and this signed release expires one (1) year after the date of origination.</p>
                                            <h3>&nbsp;</h3>
                                    `)}
                                </div>
                                <form id="background-check-form" className="background-check-form"
                                      onSubmit={this.handleSubmit}>
                                    <div className="col-md-8 offset-md-2 form-section-1 loading-container">
                                        {
                                            this.state.loading ? (
                                                <div className="card-loading">
                                                    <CircularProgressLoading/>
                                                </div>
                                            ) : ''
                                        }
                                        <div className="row">
                                            <div className="col-md-12">
                                                <span className="primary applicant-card__label">
                                                    {backgroundCheckJson[0].label}
                                                </span>
                                                <br/>
                                                <div className="onoffswitch">
                                                    <input
                                                        id="vehicleReportRequired"
                                                        type="checkbox"
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="10"
                                                        form="background-check-form"
                                                        className="onoffswitch-checkbox"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                vehicleReportRequired: e.target.checked
                                                            }, () => {
                                                                if (this.state.vehicleReportRequired === false) {
                                                                    this.setState({
                                                                        vehicleReportRequired: false,
                                                                        driverLicenseNumber: '',
                                                                        commercialDriverLicense: false,
                                                                        licenseState: "",
                                                                        licenseExpiration: "",
                                                                    })
                                                                }
                                                            });

                                                            console.log(e.target.checked);
                                                        }}
                                                        value={this.state.vehicleReportRequired}
                                                        checked={this.state.vehicleReportRequired}
                                                        disabled={this.state.editing}
                                                    />
                                                    <label className="onoffswitch-label"
                                                           htmlFor="vehicleReportRequired">
                                                        <span className="onoffswitch-inner"/>
                                                        <span className="onoffswitch-switch"/>
                                                    </label>
                                                </div>
                                                {/*<label className="switch">*/}
                                                {/*<input*/}
                                                {/*id="vehicleReportRequired"*/}
                                                {/*type="checkbox"*/}
                                                {/*className="form-control"*/}
                                                {/*min="0"*/}
                                                {/*maxLength="50"*/}
                                                {/*minLength="10"*/}
                                                {/*form="background-check-form"*/}
                                                {/*onChange={(e) => {*/}
                                                {/*this.setState({*/}
                                                {/*vehicleReportRequired: e.target.checked*/}
                                                {/*}, () => {*/}
                                                {/*if (this.state.vehicleReportRequired === false) {*/}
                                                {/*this.setState({*/}
                                                {/*vehicleReportRequired: false,*/}
                                                {/*driverLicenseNumber: '',*/}
                                                {/*commercialDriverLicense: false,*/}
                                                {/*licenseState: "",*/}
                                                {/*licenseExpiration: "",*/}
                                                {/*})*/}
                                                {/*}*/}
                                                {/*})*/}
                                                {/*}}*/}
                                                {/*value={this.state.vehicleReportRequired}*/}
                                                {/*checked={this.state.vehicleReportRequired}*/}
                                                {/*disabled={this.state.editing}*/}
                                                {/*/>*/}
                                                {/*<p className="slider round"></p>*/}
                                                {/*</label>*/}
                                            </div>
                                            <div className="col-md-12">
                                                <label className="primary applicant-card__label">
                                                    {backgroundCheckJson[1].label}
                                                </label>
                                                <input
                                                    id="driverLicenseNumber"
                                                    name="studyType"
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                    min="0"
                                                    pattern=".*[^ ].*"
                                                    maxLength="50"
                                                    minLength="2"
                                                    form="background-check-form"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            driverLicenseNumber: e.target.value
                                                        })
                                                    }}
                                                    value={this.state.driverLicenseNumber}
                                                    disabled={this.state.editing || !this.state.vehicleReportRequired}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="primary applicant-card__label">
                                                    {backgroundCheckJson[2].label}
                                                </label>
                                                <Query query={GET_STATES_QUERY} variables={{parent: 6}}>
                                                    {({loading, error, data, refetch, networkStatus}) => {
                                                        //if (networkStatus === 4) return <LinearProgress />;
                                                        if (error) return <p>Error </p>;
                                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                            return (
                                                                <select
                                                                    id="licenseState"
                                                                    name="licenseState"
                                                                    required
                                                                    className="form-control"
                                                                    form="background-check-form"
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            licenseState: e.target.value
                                                                        })
                                                                    }}
                                                                    value={this.state.licenseState}
                                                                    disabled={this.state.editing || !this.state.vehicleReportRequired}
                                                                >
                                                                    <option value="">Select a state</option>
                                                                    {data.getcatalogitem.map((item) => (
                                                                        <option value={item.Id}>{item.Name}</option>
                                                                    ))}
                                                                </select>
                                                            );
                                                        }
                                                        return <SelectNothingToDisplay/>;
                                                    }}
                                                </Query>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="primary applicant-card__label">
                                                    {backgroundCheckJson[3].label}
                                                </label>
                                                <input
                                                    id="licenseExpiration"
                                                    name="licenseExpiration"
                                                    type="date"
                                                    className="form-control"
                                                    required
                                                    min="0"
                                                    maxLength="100"
                                                    minLength="2"
                                                    form="background-check-form"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            licenseExpiration: e.target.value
                                                        })
                                                    }}
                                                    value={this.state.licenseExpiration}
                                                    disabled={this.state.editing || !this.state.vehicleReportRequired}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <span className="primary applicant-card__label">
                                                    {backgroundCheckJson[4].label}
                                                </span>
                                                <br/>
                                                <div className="onoffswitch">
                                                    <input
                                                        id="commercialDriverLicense"
                                                        type="checkbox"
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="10"
                                                        form="background-check-form"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                commercialDriverLicense: e.target.checked
                                                            }, () => {
                                                                console.log("commercialDriverLicense: " + this.state.commercialDriverLicense);
                                                            })
                                                        }}
                                                        value={this.state.commercialDriverLicense}
                                                        checked={this.state.commercialDriverLicense}
                                                        disabled={this.state.editing || !this.state.vehicleReportRequired}
                                                        className="onoffswitch-checkbox"
                                                    />
                                                    <label className="onoffswitch-label"
                                                           htmlFor="commercialDriverLicense">
                                                        <span className="onoffswitch-inner"/>
                                                        <span className="onoffswitch-switch"/>
                                                    </label>
                                                </div>
                                                {/*<label className="switch">*/}
                                                {/*<input*/}
                                                {/*id="commercialDriverLicense"*/}
                                                {/*type="checkbox"*/}
                                                {/*className="form-control"*/}
                                                {/*min="0"*/}
                                                {/*maxLength="50"*/}
                                                {/*minLength="10"*/}
                                                {/*form="background-check-form"*/}
                                                {/*onChange={(e) => {*/}

                                                {/*this.setState({*/}
                                                {/*commercialDriverLicense: e.target.checked*/}
                                                {/*})*/}
                                                {/*}}*/}
                                                {/*value={this.state.commercialDriverLicense}*/}
                                                {/*checked={this.state.commercialDriverLicense}*/}
                                                {/*disabled={this.state.editing || !this.state.vehicleReportRequired}*/}
                                                {/*/>*/}
                                                {/*<p className="slider round"></p>*/}
                                                {/*</label>*/}
                                            </div>
                                            {
                                                this.state.signature !== '' ? (
                                                    <div className="col-md-12">
                                                        <br/>
                                                        <div className="signature-form-section">
                                                            <img
                                                                src={this.state.signature}
                                                                id="signature-form-canvas"
                                                            />
                                                            {
                                                                !this.state.editing ? (
                                                                    <div
                                                                        className="bottom-signature-options"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                openSignature: true
                                                                            });
                                                                        }}>Sign Again
                                                                    </div>
                                                                ) : (
                                                                    ''
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ''
                                                )
                                            }
                                            {
                                                this.state.editing ? (
                                                    ''
                                                ) : (
                                                    <div className="col-md-6">
                                                        <div className="privacy-policy-section">
                                                            <input
                                                                id="accept"
                                                                onChange={(event) => {
                                                                    this.setState({
                                                                        accept: event.target.checked,
                                                                        openSignature: event.target.checked
                                                                    }, () => {
                                                                        if (this.state.accept === false) {
                                                                            this.setState({
                                                                                signature: ''
                                                                            })
                                                                        }
                                                                    });
                                                                }}
                                                                checked={this.state.accept}
                                                                value={this.state.accept}
                                                                type="checkbox"
                                                                min="0"
                                                                maxLength="50"
                                                                minLength="10"
                                                                form="background-check-form"
                                                            />
                                                            <span className="primary applicant-card__label">
                                                                    <a href="#">{backgroundCheckJson[5].label}</a>
                                                    </span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <br/>
                                        {
                                            this.state.editing ? (
                                                ''
                                            ) : (
                                                <div className="applicant-card__footer">
                                                    <br/>
                                                    {
                                                        this.state.id !== null ? (
                                                            <button
                                                                className="applicant-card__cancel-button"
                                                                type="reset"
                                                                onClick={() => {
                                                                    this.getBackgroundCheckById(this.props.applicationId);
                                                                }}
                                                            >
                                                                {spanishActions[2].label}
                                                            </button>
                                                        ) : ('')
                                                    }
                                                    <button
                                                        disabled={!this.state.accept}
                                                        className="applicant-card__save-button"
                                                        type="submit">
                                                        {spanishActions[4].label}
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                </form>
                                <div className="col-md-10">
                                    <b>
                                        In connection with this request, I hereby release the aforesaid parties from any liability and responsibility for obtaining my investigative background inquiry.
                                    </b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    renderSignatureDialog()
                }
            </div>
        );
    }
}

export default withApollo(withMobileDialog()(withGlobalContent(BackgroundCheck)));