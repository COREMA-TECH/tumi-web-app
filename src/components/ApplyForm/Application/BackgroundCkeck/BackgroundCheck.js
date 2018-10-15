import React, {Component} from 'react';
import './index.css';
import withApollo from "react-apollo/withApollo";
import {ADD_BACKGROUND_CHECK} from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import {GET_STATES_QUERY} from "../../Queries";
import SelectNothingToDisplay
    from "../../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";
import Query from "react-apollo/Query";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import CircularProgressLoading from "../../../material-ui/CircularProgressLoading";
import {GET_BACKGROUND_CHECK_INFO} from "./Queries";

const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class BackgroundCheck extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vehicleReportRequired: false,
            driverLicenseNumber: '',
            licenseState: null,
            licenseExpiration: null,
            commercialDriverLicense: false,
            accept: false,
            signature: '',

            // signature dialog state property
            openSignature: false,
            loading: false
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
                    query: GET_BACKGROUND_CHECK_INFO,
                    variables: {
                        id: id
                    }
                })
                .then(({data}) => {
                    this.setState({
                        loading: false,
                        vehicleReportRequired: data.applicantBackgroundCheck.vehicleReportRequired,
                        driverLicenseNumber: data.applicantBackgroundCheck.driverLicenseNumber,
                        licenseState: data.applicantBackgroundCheck.licenseState,
                        licenseExpiration: data.applicantBackgroundCheck.licenseExpiration,
                        signature: data.applicantBackgroundCheck.signature,
                        date: data.applicantBackgroundCheck.date.substring(0, 10)
                    });
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

    componentWillMount(){
        // FIXME: pass dynamic id
        this.getBackgroundCheckById(8)
    }

    removeInvalidElementStyles = () => {
        let form = document.getElementById("background-check-form").elements;

        form.map(item => {
            item.classList.remove('invalid-apply-form');
            console.log("Item")
        });
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
                    this.removeInvalidElementStyles();

                    this.setState({
                        accept: false,
                        signature: '',
                        loading: false
                    });

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
            ApplicationId: 21
        };

        // To insert background check
        this.insertBackgroundCheck(backgroundCheckItem);
    };

    render() {
        let renderSignatureDialog = () => (
            <div>
                {
                    this.state.accept ? (
                        <Dialog
                            open={this.state.openSignature}
                            onClose={() => {
                                this.setState({
                                    openSignature: false,
                                }, () => {
                                    if(this.state.signature === ''){
                                        this.setState({
                                            accept: false
                                        })
                                    }
                                })
                            }}
                            aria-labelledby="form-dialog-title">
                            <DialogTitle>
                                <h1 className="primary apply-form-container__label text-center">Please Sign</h1>
                            </DialogTitle>
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
                            </div>
                            <div className="row">
                                <form id="background-check-form" onSubmit={this.handleSubmit}>
                                    <div className="col-3"></div>
                                    <div className="col-6 form-section-1 loading-container">
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
                                                                    form="background-check-form">
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
                                                    pattern=".*[^ ].*"
                                                    maxLength="100"
                                                    minLength="2"
                                                    form="background-check-form"
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
                                                    />
                                                    <p className="slider round"></p>
                                                </label>
                                            </div>
                                            {
                                                this.state.signature !== '' ? (
                                                    <div className="col-12">
                                                        <div className="signature-form-section">
                                                            <img src={this.state.signature}
                                                                 id="signature-form-canvas"></img>
                                                            <div className="bottom-signature-options" onClick={() => {
                                                                this.setState({
                                                                    openSignature: true
                                                                })
                                                            }}>Sign Again
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ''
                                                )
                                            }
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
                                        </div>
                                        <br/>
                                        <div className="applicant-card__footer--background">
                                            <br/>
                                            <button
                                                className="applicant-card__edit-button"
                                                type="submit">
                                                {spanishActions[4].label}
                                            </button>
                                        </div>
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

export default withApollo(withGlobalContent(BackgroundCheck));