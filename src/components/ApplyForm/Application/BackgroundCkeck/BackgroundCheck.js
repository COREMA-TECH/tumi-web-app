import React, { Component } from 'react';
import './index.css';
import gql from 'graphql-tag';
import withApollo from "react-apollo/withApollo";
import { ADD_BACKGROUND_CHECK, UPDATE_BACKGROUND_CHECK } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import { GET_STATES_QUERY } from "../../Queries";
import SelectNothingToDisplay
    from "../../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";
import Query from "react-apollo/Query";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import CircularProgressLoading from "../../../material-ui/CircularProgressLoading";
import { GET_APPLICATION_CHECK_ID } from "./Queries";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import renderHTML from "react-render-html";
import {CREATE_DOCUMENTS_PDF_QUERY} from "../W4/Queries";
import IMG from './images/background1.jpg';

import PropTypes from 'prop-types';
import {GET_APPLICANT_INFO} from "../AntiHarassment/Queries";

const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const backgroundCheckJson = require(`../languagesJSON/${localStorage.getItem('languageForm')}/backgroundCheck`);
const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);

const uuidv4 = require('uuid/v4');

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
            editing: false,
            isCreated: false,

            firstName: '',
            middleName: '',
            lastName: '',
            streetAddress: '',
            birthDay: '',
            socialSecurityNumber: '',
            zipCode: '',

            stateSelected: '',
            citySelected: '',

            stateName: '',
            cityName: '',
            licenseStateName: '',
            statesCompletes: [],


            loadingApplicantData: false
        }
    }

    getApplicantInformation = (id) => {
        this.props.client
            .query({
                query: GET_APPLICANT_INFO,
                variables: {
                    id: id
                }
            })
            .then(({ data }) => {
                if (data.applications[0] !== null) {
                    this.setState({
                        firstName: data.applications[0].firstName == null ? '' : data.applications[0].firstName,
                        middleName: data.applications[0].middleName == null ? '' : data.applications[0].middleName,
                        lastName: data.applications[0].lastName == null ? '' : data.applications[0].lastName,
                        streetAddress:  data.applications[0].streetAddress == null ? '' : data.applications[0].streetAddress,
                        birthDay:  data.applications[0].birthDay == null ? '' : data.applications[0].birthDay,
                        socialSecurityNumber:  data.applications[0].socialSecurityNumber == null ? '' : data.applications[0].socialSecurityNumber,
                        zipCode:  data.applications[0].zipCode == null ? '' : data.applications[0].zipCode,
                        stateSelected: data.applications[0].state,
                        citySelected: data.applications[0].city,
                    }, () => {
                        //this.getStates(this.state.stateSelected);
                        this.getCities(this.state.stateSelected, this.state.citySelected);
                    });
                }
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
            })
    };

    getStatesQuery = gql`
        {
            getcatalogitem(IsActive: 1, Id_Parent: 6, Id_Catalog: 3) {
                Id
                Name
                IsActive
            }
        }
    `;

    getStates = (stateId) => {
        this.props.client
            .query({
                query: this.getStatesQuery,
            })
            .then(({data}) => {
                let dataInfo = data.getcatalogitem;

                let stateSelect = dataInfo.find((element) => {
                    return element.Id == stateId;
                });

                let stateLicenseSelected = dataInfo.find((element) => {
                    return element.Id == this.state.licenseState;
                });

                if(stateSelect != undefined && stateLicenseSelected != undefined) {
                    this.setState({
                        stateName: stateSelect.Name,
                        licenseStateName: stateLicenseSelected.Name,
                    })
                }

                this.setState({
                    loadingApplicantData: false,
                    statesCompletes: dataInfo
                })
            })
    };


    updateStateInPDF = () => {
        let stateSelect = this.state.statesCompletes.find((element) => {
            return element.Id == this.state.licenseState;
        });

        if(stateSelect != undefined) {
            this.setState({
                licenseStateName: stateSelect.Name
            });
        }
    };

    GET_CITIES_QUERY = gql`
        query Cities($parent: Int!) {
            getcatalogitem( IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
                Id
                Name
                IsActive
            }
        }
    `;

    getCities = (stateId, cityId) => {
        this.props.client
            .query({
                query: this.GET_CITIES_QUERY,
                variables: {
                    parent: stateId
                }
            })
            .then(({data}) => {
                let dataInfo = data.getcatalogitem;

                let citySelect = dataInfo.find((element) => {
                    return element.Id == cityId;
                });




                if(citySelect != undefined) {
                    this.setState({
                        cityName: citySelect.Name
                    })
                }

                this.getStates(stateId)
            })
    };

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
                .then(({ data }) => {

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
                            accept: true,
                            isCreated: true
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
                ApplicationId: this.props.applicationId,
                completed: true
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
                ApplicationId: this.props.applicationId,
                completed: true
            };
        }


        // To insert background check
        if (this.state.id === null) {
            this.insertBackgroundCheck(backgroundCheckItem);
        } else {
            backgroundCheckItem.id = this.state.id;
            this.updateBackgroundCheck(backgroundCheckItem);
        }
    };

    componentWillMount() {
        // FIXME: pass dynamic id
        this.getBackgroundCheckById(this.props.applicationId);
        this.setState({
            loadingApplicantData: true
        }, () => {
            this.getApplicantInformation(this.props.applicationId);
        });
    }

    createDocumentsPDF = (random) => {

        this.setState(
            {
                downloading: true
            }
        )
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: document.getElementById('DocumentPDF').innerHTML,
                    Name: "background-check-" + random
                },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.createdocumentspdf != null) {

                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: createdocumentspdf not exists in query data'
                    );
                    this.setState({ loadingData: false, downloading: false });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                this.setState({ loadingData: false, downloading: false });
            });
    };


    downloadDocumentsHandler = (random) => {
        var url = this.context.baseUrl + '/public/Documents/' + "background-check-" + random + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 5000));
    }



    render() {
        const { fullScreen } = this.props;

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
                                <div>
                                    {
                                        this.state.isCreated && !this.state.loadingApplicantData ? (
                                            <button className="applicant-card__edit-button" onClick={() => {
                                                let random = uuidv4();

                                                this.createDocumentsPDF(random);
                                                this.sleep().then(() => {
                                                    this.downloadDocumentsHandler(random);
                                                }).catch(error => {
                                                    this.setState({downloading: false})
                                                })
                                            }}>{this.state.downloading && (
                                                <React.Fragment>Downloading <i
                                                    className="fas fa-spinner fa-spin"/></React.Fragment>)}
                                                {!this.state.downloading && (
                                                    <React.Fragment>{spanishActions[9].label} <i
                                                        className="fas fa-download"/></React.Fragment>)}

                                            </button>
                                        ) : (
                                            ''
                                        )
                                    }
                                    {
                                        this.state.editing ? (
                                            <button
                                                style={{
                                                    marginLeft: '5px'
                                                }}
                                                className="applicant-card__edit-button" onClick={() => {
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

                            </div>

                            <div className="row" id="">
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
                                                    <CircularProgressLoading />
                                                </div>
                                            ) : ''
                                        }
                                        <div className="row">
                                            <div className="col-md-12">
                                                <span className="primary applicant-card__label">
                                                    {backgroundCheckJson[0].label}
                                                </span>
                                                <br />
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
                                                        <span className="onoffswitch-inner" />
                                                        <span className="onoffswitch-switch" />
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
                                                <Query query={GET_STATES_QUERY} variables={{ parent: 6 }}>
                                                    {({ loading, error, data, refetch, networkStatus }) => {
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
                                                                        }, () => {
                                                                            this.updateStateInPDF(this.state.licenseState)
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
                                                        return <SelectNothingToDisplay />;
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
                                                <br />
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
                                                        <span className="onoffswitch-inner" />
                                                        <span className="onoffswitch-switch" />
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
                                                        <br />
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
                                        <br />
                                        {
                                            this.state.editing ? (
                                                ''
                                            ) : (
                                                    <div className="applicant-card__footer">
                                                        <br />
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
                                <div className="col-md-8 offset-md-2">
                                    <br /><br />
                                    <h5>In connection with this request, I hereby release the aforesaid parties from any liability and responsibility for obtaining my investigative background inquiry.</h5>
                                    <br /><br />
                                    {/*{renderHTML(`*/}
                                    {/*<p>&nbsp;</p>*/}
                                    {/*<table style="border-collapse: collapse; width: 100%; height: 67px;" border="1">*/}
                                    {/*<tbody>*/}
                                    {/*<tr style="height: 67px;">*/}
                                    {/*<td style="width: 50%; height: 67px; text-align: left;">&nbsp;</td>*/}
                                    {/*<td style="width: 50%; height: 67px;">&nbsp;</td>*/}
                                    {/*</tr>*/}
                                    {/*</tbody>*/}
                                    {/*</table>*/}
                                    {/*<p>&nbsp;</p>*/}
                                    {/*`)}*/}
                                </div>
                            </div>
                            <div style={{position: 'relative', display: 'none', width: '1200px',
                                margin: 'auto'}}>
                                {
                                    this.state.isCreated ? (
                                        <div className="row" id="DocumentPDF">
                                            <div style={{width: '600px', margin: '0 auto'}}>
                                                <p><img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src="https://i.imgur.com/fSpWZzj.png" alt width={600} height={170} /></p>
                                                <div title="Page 1">
                                                    <table style={{borderCollapse: 'collapse', width: '96.9636%', height: '59px'}} border={0}>
                                                        <tbody>
                                                        <tr style={{height: '59px'}}>
                                                            <td style={{width: '100%', height: '59px', textAlign: 'left', paddingLeft: '40px'}}>
                                                                <p><span style={{fontFamily: 'arial, helvetica, sans-serif', color: '#000000'}}>In connection with my application for employment, I understand that an investigative background inquiry is to be made on myself, including, but no limited to, identity and prior address(es) verification, criminal history, driving record, consumer credit history, education verification, prior employment verification and other references as well as other information.</span></p>
                                                                <div title="Page 1">
                                                                    <div>
                                                                        <div>
                                                                            <p><span style={{fontFamily: 'arial, helvetica, sans-serif', color: '#000000'}}>I further understand that for the purposes of this background inquiry, various sources will be contacted to provide information, including but not limited to various Federal, State, County, municipal, corporate, private and other agencies, which may maintain records concerning my past activities relating to my criminal conduct, civil court litigation, driving record, and credit performance, as well as various other experiences.</span></p>
                                                                            <p><span style={{fontFamily: 'arial, helvetica, sans-serif', color: '#000000'}}>I hereby authorize without reservation, any company, agency, party of other source contracted to furnish the above information as requested. I do hereby release, discharge and indemnify the prospective employer, it’s agents and associates to the full extent permitted by law from any claims, damages, losses, liabilities, cost and expenses arising from the retrieving and reporting of the requested information.</span></p>
                                                                            <p><span style={{fontFamily: 'arial, helvetica, sans-serif', color: '#000000'}}>I acknowledge that a photocopy of this authorization be accepted with the same authority as the original and this signed release expires one (1) year after the date of origination.</span></p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    <p>&nbsp;</p>
                                                </div>
                                                <table style={{
                                                    marginTop: '220px',
                                                    backgroundColor: '#ddd',
                                                    borderCollapse: 'collapse', width: '97.0648%', height: '35px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '35px'}}>
                                                        <td style={{width: '100%', height: '35px'}}>
                                                            <div title="Page 1">
                                                                <div>
                                                                    <div>
                                                                        <div style={{textAlign: 'center'}}><span style={{fontFamily: '"arial black", sans-serif', color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>APPLICANT INFORMATION</strong></span></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{borderCollapse: 'collapse', width: '97.0663%'}} border={1}>
                                                    <tbody>
                                                    <tr>
                                                        <td style={{width: '100%'}}><strong><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}>Please print clearly, use black ink, and use your full legal name.</span></strong></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{borderCollapse: 'collapse', width: '97.0663%', height: '28px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '17px'}}>
                                                        <td style={{width: '33.3333%', height: '28px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>FIRST NAME:</strong></span></div>
                                                            <div title="Page 1">{this.state.firstName}</div>
                                                        </td>
                                                        <td style={{width: '33.3333%', height: '28px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>MIDDLE NAME:</strong></span></div>
                                                            <div title="Page 1">&nbsp;{this.state.middleName}</div>
                                                        </td>
                                                        <td style={{width: '33.3333%', height: '28px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>LAST NAME:</strong></span></div>
                                                            <div title="Page 1">&nbsp;{this.state.lastName}</div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{borderCollapse: 'collapse', width: '97.0648%', height: '17px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '17px'}}>
                                                        <td style={{width: '33.3333%', height: '17px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>SOCIAL SECURITY NUMBER:</strong></span></div>
                                                            <div title="Page 1">{this.state.socialSecurityNumber}</div>
                                                        </td>
                                                        <td style={{width: '33.3333%', height: '17px'}}>
                                                            <div title="Page 1">
                                                                <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>DATE OF BIRTH:</strong></span></div>
                                                                <div title="Page 1">{this.state.birthDay.substring(0, 10)}</div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{borderCollapse: 'collapse', width: '97.0648%', height: '41px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '41px'}}>
                                                        <td style={{width: '100%', height: '41px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>CURRENT STREET ADDRESS:</strong></span></div>
                                                            <div title="Page 1">{this.state.streetAddress}</div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{borderCollapse: 'collapse', width: '97.0652%', height: '41px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '41px'}}>
                                                        <td style={{width: '50.0173%', height: '41px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>CITY:</strong></span><span>{this.state.cityName}</span></div>
                                                            {/*<div title="Page 1">{this.state.cityName}</div>*/}
                                                        </td>
                                                        <td style={{width: '28.7453%', height: '41px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>STATE:</strong></span><span>{this.state.stateName}</span></div>
                                                            <div title="Page 1">{}</div>
                                                        </td>
                                                        <td style={{width: '18.4013%', height: '41px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>ZIP CODE:</strong></span></div>
                                                            <div title="Page 1">{this.state.zipCode}</div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <p>&nbsp;</p>
                                                <p>&nbsp;</p>
                                                <div title="Page 1">
                                                    <p>&nbsp;</p>
                                                </div>
                                                <table style={{backgroundColor: '#ddd', borderCollapse: 'collapse', width: '97.0648%', height: '35px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '35px'}}>
                                                        <td style={{width: '100%', height: '35px'}}>
                                                            <div title="Page 1">
                                                                <div>
                                                                    <div>
                                                                        <div style={{textAlign: 'center'}}><span style={{fontFamily: '"arial black", sans-serif', color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>MOTOR VEHICLE RECORD</strong></span></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{borderCollapse: 'collapse', width: '97.0648%', height: '42px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '42px'}}>
                                                        <td style={{width: '100%', height: '42px'}}>
                                                            <div title="Page 1" style={{
                                                                display:'flex',
                                                                flexDirection:'row',
                                                            }}>
                                                                <span style={{color: '#000000'}}>
                                                                <span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>WILL A MOTOR VEHICLE REPORT BE REQUIRED?: </strong>
                                                                </span>
                                                            </span>
                                                            {
                                                                console.log("The value is: ", this.state.vehicleReportRequired)
                                                            }
                                                                {
                                                                    this.state.vehicleReportRequired ? (
                                                                        <span style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            marginLeft: '10px',
                                                                            position: 'relative',
                                                                            top: '-5px'
                                                                        }}>
                                                                            <div style={{
                                                                                width: '20px',
                                                                                display: 'inline',
                                                                                marginRight: '5px'
                                                                            }}>
                                                                                <label htmlFor="" style={{
                                                                                    width: '100%'
                                                                                }}>Yes</label>
                                                                                <input type="checkbox"
                                                                                       value={true}
                                                                                       defaultChecked={true}/>
                                                                            </div>
                                                                            <div style={{
                                                                                width: '20px',
                                                                                display: 'inline',
                                                                            }}>
                                                                                <label htmlFor="" style={{
                                                                                    width: '100%'
                                                                                }}>No</label>
                                                                                <input type="checkbox" value={false} defaultChecked={false}/>

                                                                            </div>
                                                        </span>
                                                                    ) : (
                                                                        <span style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            marginLeft: '10px',
                                                                            position: 'relative',
                                                                            top: '-5px'
                                                                        }}>
                                                                            <div style={{
                                                                                width: '20px',
                                                                                display: 'inline',
                                                                                marginRight: '5px'
                                                                            }}>
                                                                                <label htmlFor="" style={{
                                                                                    width: '100%'
                                                                                }}>Yes</label>
                                                                                <input type="checkbox"
                                                                                       value={false}
                                                                                       defaultChecked={false}/>
                                                                            </div>
                                                                            <div style={{
                                                                                width: '20px',
                                                                                display: 'inline',
                                                                            }}>
                                                                                <label htmlFor="" style={{
                                                                                    width: '100%'
                                                                                }}>No</label>
                                                                                <input type="checkbox" value={true} defaultChecked={true}/>

                                                                            </div>
                                                                        </span>
                                                                    )
                                                                }</div>
                                                            <div title="Page 1"><br /><br /></div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <table style={{borderCollapse: 'collapse', width: '97.0652%', height: '44px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '44px'}}>
                                                        <td style={{width: '50.0173%', height: '44px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>DRIVERS LICENSE NUMBER:</strong></span></div>
                                                            <div title="Page 1">{this.state.driverLicenseNumber}</div>
                                                        </td>
                                                        <td style={{width: '28.7453%', height: '44px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>STATE: </strong></span><span>{this.state.licenseStateName}</span><span>
                                                            </span><span>
                                                            {

                                                            }
                                                        </span></div>
                                                            <div title="Page 1"></div>
                                                        </td>
                                                        <td style={{width: '18.4013%', height: '44px'}}>
                                                            <div title="Page 1"><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>EXPIRATION:</strong></span></div>
                                                            <div title="Page 1">{this.state.licenseExpiration}</div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <div title="Page 1">
                                                    <table style={{borderCollapse: 'collapse', width: '97.0648%', height: '45px'}} border={1}>
                                                        <tbody>
                                                        <tr style={{height: '45px'}}>
                                                            <td style={{width: '100%', height: '45px', display:'flex',
                                                                flexDirection:'row'}}>
                                                                <span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}>
                                                                <strong>IS THIS A COMMERCIAL DRIVERS LICENSE?:</strong></span><span>
                                                                {
                                                                    this.state.commercialDriverLicense ? (
                                                                        <span style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            marginLeft: '10px',
                                                                            position: 'relative',
                                                                            top: '-5px'
                                                                        }}>
                                                                            <div style={{
                                                                                width: '20px',
                                                                                display: 'inline',
                                                                                marginRight: '5px'
                                                                            }}>
                                                                                <label htmlFor="" style={{
                                                                                    width: '100%'
                                                                                }}>Yes</label>
                                                                                <input type="checkbox"
                                                                                       value={true}
                                                                                       defaultChecked={true}/>
                                                                            </div>
                                                                            <div style={{
                                                                                width: '20px',
                                                                                display: 'inline',
                                                                            }}>
                                                                                <label htmlFor="" style={{
                                                                                    width: '100%'
                                                                                }}>No</label>
                                                                                <input type="checkbox" value={false} defaultChecked={false}/>

                                                                            </div>
                                                        </span>
                                                                    ) : (
                                                                        <span style={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            marginLeft: '10px',
                                                                            position: 'relative',
                                                                            top: '-5px'
                                                                        }}>
                                                                            <div style={{
                                                                                width: '20px',
                                                                                display: 'inline',
                                                                                marginRight: '5px'
                                                                            }}>
                                                                                <label htmlFor="" style={{
                                                                                    width: '100%'
                                                                                }}>Yes</label>
                                                                                <input type="checkbox"
                                                                                       value={false}
                                                                                       defaultChecked={false}/>
                                                                            </div>
                                                                            <div style={{
                                                                                width: '20px',
                                                                                display: 'inline',
                                                                            }}>
                                                                                <label htmlFor="" style={{
                                                                                    width: '100%'
                                                                                }}>No</label>
                                                                                <input type="checkbox" value={true} defaultChecked={true}/>

                                                                            </div>
                                                                        </span>
                                                                    )
                                                                }
                                                            </span></td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <p>&nbsp;</p>
                                                <table style={{borderCollapse: 'collapse', width: '97.2672%', height: '17px'}} border={0}>
                                                    <tbody>
                                                    <tr style={{height: '17px'}}>
                                                        <td style={{width: '100%', height: '17px', textAlign: 'justify'}}><span style={{fontFamily: 'arial, helvetica, sans-serif'}}><strong><span style={{color: '#000000'}}>In connection with this request, I hereby release the aforesaid parties from any liability and responsibility for obtaining my investigative background inquiry.</span></strong></span></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <p>&nbsp;</p>
                                                <table style={{borderCollapse: 'collapse', width: '97.0648%', height: '17px'}} border={1}>
                                                    <tbody>
                                                    <tr style={{height: '17px'}}>
                                                        <td style={{width: '50%', height: '17px'}}><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>SIGNATURE: </strong></span>
                                                            <img style={{
                                                                width: '100px',
                                                                height: '30px',
                                                                display: 'inline-block',
                                                                backgroundColor: '#f9f9f9',
                                                                margin: 'auto'
                                                            }} src={this.state.signature} alt=""/>
                                                        </td>
                                                        <td style={{width: '47.1631%', height: '17px'}}><span style={{color: '#000000',    fontWeight: '400', marginLeft: '2px'}}><strong>DATE: </strong></span><span>{new Date().toISOString().substring(0, 10)}</span></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <p>&nbsp;</p>
                                                <table style={{borderCollapse: 'collapse', width: '97.0648%', height: '17px'}} border={0}>
                                                    <tbody>
                                                    <tr style={{height: '17px'}}>
                                                        <td style={{width: '50%', height: '17px'}}>
                                                            <div title="Page 1">
                                                                <div>
                                                                    <div>
                                                                        <p>Background Authorization - English</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{width: '47.1631%', height: '17px'}}>
                                                            <div title="Page 1">
                                                                <div>
                                                                    <div>
                                                                        <p style={{textAlign: 'right'}}>Tumi Staffing – Updated 5-6-2013</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <p>&nbsp;</p>
                                                <p>&nbsp;</p>
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )
                                }
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


    static contextTypes = {
        baseUrl: PropTypes.string
    };

    static contextTypes = {
        baseUrl: PropTypes.string
    };
}

export default withApollo(withMobileDialog()(withGlobalContent(BackgroundCheck)));