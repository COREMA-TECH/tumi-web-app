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

const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

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
                            licenseState: data.applications[0].backgroundCheck.licenseState,
                            licenseExpiration: data.applications[0].backgroundCheck.licenseExpiration.substring(0, 10),
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

                    alert(error);

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

        // Build the object with form information
        let backgroundCheckItem = {
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
                            fullScreen={fullScreen}
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
                                <h1 className="primary apply-form-container__label">Please Sign</h1>
                                <Button color="default" onClick={() => {
                                    this.setState({
                                        openSignature: false,
                                    });
                                }}>
                                    Close
                                </Button>
                            </Toolbar>
                            <DialogContent>
                                <SignatureForm applicationId={this.state.applicationId}
                                               signatureValue={this.handleSignature}/>
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
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Background Check</span>
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
                                <form id="background-check-form" className="background-check-form"
                                      onSubmit={this.handleSubmit}>
                                    <div className="col-2"></div>
                                    <div className="col-8 form-section-1 loading-container">
                                        {
                                            this.state.loading ? (
                                                <div className="card-loading">
                                                    <CircularProgressLoading/>
                                                </div>
                                            ) : ''
                                        }
                                        <div className="row">
                                            <div className="col-12">
                                                <span className="primary applicant-card__label">
                                                    Will a Motor Vehicle Report be Required?
                                                </span>
                                                <br/>
                                                <label className="switch">
                                                    <input
                                                        id="vehicleReportRequired"
                                                        type="checkbox"
                                                        className="form-control"
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="10"
                                                        form="background-check-form"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                vehicleReportRequired: e.target.checked
                                                            })
                                                        }}
                                                        value={this.state.vehicleReportRequired}
                                                        checked={this.state.vehicleReportRequired}
                                                        disabled={this.state.editing}
                                                    />
                                                    <p className="slider round"></p>
                                                </label>
                                            </div>
                                            <div className="col-12">
                                                <label className="primary applicant-card__label">
                                                    Drivers License Number
                                                </label>
                                                <input
                                                    id="driverLicenseNumber"
                                                    name="studyType"
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                    min="0"
                                                    pattern=".*[^ ].*"
                                                    maxLength="100"
                                                    minLength="2"
                                                    form="background-check-form"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            driverLicenseNumber: e.target.value
                                                        })
                                                    }}
                                                    value={this.state.driverLicenseNumber}
                                                    disabled={this.state.editing}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="primary applicant-card__label">
                                                    State
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
                                                                    disabled={this.state.editing}
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
                                            <div className="col-6">
                                                <label className="primary applicant-card__label">
                                                    Expiration Date
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
                                                    disabled={this.state.editing}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <span className="primary applicant-card__label">
                                                    Is This a Commercial Drivers License?
                                                </span>
                                                <br/>
                                                <label className="switch">
                                                    <input
                                                        id="commercialDriverLicense"
                                                        type="checkbox"
                                                        className="form-control"
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="10"
                                                        form="background-check-form"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                commercialDriverLicense: e.target.checked
                                                            })
                                                        }}
                                                        value={this.state.commercialDriverLicense}
                                                        checked={this.state.commercialDriverLicense}
                                                        disabled={this.state.editing}
                                                    />
                                                    <p className="slider round"></p>
                                                </label>
                                            </div>
                                            {
                                                this.state.signature !== '' ? (
                                                    <div className="col-12">
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
                                                    <div className="col-6">
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
                                                        <a href="#">Accept</a> and Sign
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