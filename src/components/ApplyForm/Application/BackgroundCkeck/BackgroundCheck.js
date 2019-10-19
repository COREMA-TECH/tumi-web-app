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
import { GET_APPLICATION_CHECK_ID, GET_DOCUMENT_TYPE } from "./Queries";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import renderHTML from "react-render-html";
import { CREATE_DOCUMENTS_PDF_QUERY } from "../W4/Queries";

import PropTypes from 'prop-types';
import { GET_APPLICANT_INFO } from "../AntiHarassment/Queries";
import moment from 'moment';
import DatePicker from "react-datepicker";
import Document from './Document';

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


            loadingApplicantData: false,
            urlPDF: null,
            userId: 0,
            typeDocumentId: 0
        }
    }

    formatDate = (date, useSubstring = false, customFormat = 'YYYY-MM-DD') => {
        if (!date) return '';

        let substringDate = useSubstring ? String(date).substring(0, 10) : date;
        return moment(substringDate).format(customFormat);
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
                        streetAddress: data.applications[0].streetAddress == null ? '' : data.applications[0].streetAddress,
                        birthDay: data.applications[0].birthDay == null ? '' : data.applications[0].birthDay,
                        socialSecurityNumber: data.applications[0].socialSecurityNumber == null ? '' : data.applications[0].socialSecurityNumber,
                        zipCode: data.applications[0].zipCode == null ? '' : data.applications[0].zipCode,
                        stateSelected: data.applications[0].state,
                        citySelected: data.applications[0].city,
                    }, () => {
                        //this.getStates(this.state.stateSelected);
                        this.getCities(this.state.stateSelected, this.state.citySelected);
                    });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loadingApplicantData: false,
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
            .then(({ data }) => {
                let dataInfo = data.getcatalogitem;

                let stateSelect = dataInfo.find((element) => {
                    return element.Id == stateId;
                });

                let stateLicenseSelected = dataInfo.find((element) => {
                    return element.Id == this.state.licenseState;
                });

                if (stateSelect != undefined && stateLicenseSelected != undefined) {
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
            .catch(error => {
                this.setState({
                    loadingApplicantData: false
                });
                console.log(error);
            })
    };


    updateStateInPDF = () => {
        let stateSelect = this.state.statesCompletes.find((element) => {
            return element.Id == this.state.licenseState;
        });

        if (stateSelect != undefined) {
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
            .then(({ data }) => {
                let dataInfo = data.getcatalogitem;

                let citySelect = dataInfo.find((element) => {
                    return element.Id == cityId;
                });

                if (citySelect != undefined) {
                    this.setState({
                        cityName: citySelect.Name
                    })
                }

                this.getStates(stateId)
            })
            .catch(error => {
                this.setState({
                    loadingApplicantData: false
                });
                console.log(error);
            });
    };

    getBackgroundCheckById = (id) => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: GET_APPLICATION_CHECK_ID,
                    variables: {
                        ApplicationId: id,
                        ApplicationDocumentTypeId: this.state.typeDocumentId
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {

                    if (data.lastApplicantLegalDocument) {
                        const fd = data.lastApplicantLegalDocument.fieldsData;
                        const formData = fd ? JSON.parse(fd) : {};
                        const licenseExpiration = this.formatDate(formData.licenseExpiration, false, 'YYYY-MM-DD');
                        const date = this.formatDate(formData.date, false, 'YYYY-MM-DD');

                        this.setState(() => ({
                            loading: false,
                            id: 1,
                            vehicleReportRequired: formData.vehicleReportRequired,
                            driverLicenseNumber: formData.driverLicenseNumber,
                            commercialDriverLicense: formData.commercialDriverLicense,
                            licenseState: formData.licenseState,
                            licenseExpiration,
                            signature: formData.signature,
                            date,
                            loadedBackgroundCheckById: true,
                            urlPDF: data.lastApplicantLegalDocument.url,
                            editing: true,
                            accept: true,
                            isCreated: true
                        }));
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

    getDocumentType = () => {
        this.props.client
            .query({
                query: GET_DOCUMENT_TYPE,
                variables: {
                    name: 'Background Check'
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applicationDocumentTypes.length) {
                    this.setState(() => ({
                        typeDocumentId: data.applicationDocumentTypes[0].id
                    }), () => {
                        this.getBackgroundCheckById(this.props.applicationId);
                        this.getApplicantInformation(this.props.applicationId);
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

    insertBackgroundCheck = (jsonFields) => {
        const random = uuidv4();
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .mutate({
                    mutation: ADD_BACKGROUND_CHECK,
                    variables: {
                        fileName: "BackgroundCheck-" + random + this.props.applicationId,
                        html: this.cloneForm(),
                        applicantLegalDocument: {
                            fieldsData: jsonFields,
                            ApplicationDocumentTypeId: this.state.typeDocumentId,
                            ApplicationId: this.props.applicationId,
                            UserId: this.state.userId,
                            completed: true
                        }
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

                    this.props.changeTabState();
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
                        'Error to update background check information. Please, try again!',
                        'bottom',
                        'right'
                    );

                    this.setState({
                        loading: false
                    });
                })
        });
    };

    updatePdfUrlBackgroundCheck = () => {
        this.props.client
            .mutate({
                mutation: UPDATE_BACKGROUND_CHECK,
                variables: {
                    backgroundCheck: {
                        id: this.state.id,
                        pdfUrl: this.state.urlPDF,
                        content: this.state.content || '',
                        ApplicationId: this.props.applicationId
                    }
                }
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to updating url background check',
                    'bottom',
                    'right'
                );
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
        const { firstName, middleName, lastName } = this.state;

        // Build the object with form information
        if (form.item(0).checked) {
            backgroundCheckItem = {
                vehicleReportRequired: form.item(0).checked,
                driverLicenseNumber: form.item(1).value.trim(),
                commercialDriverLicense: form.item(4).checked,
                licenseState: form.item(2).value.trim(),
                licenseExpiration: this.formatDate(form.item(3).value.trim()),
                date: this.formatDate(new Date().toISOString()),
                signature: this.state.signature,
                applicantName: [firstName || '', middleName || '', lastName || ''].join(' ')
            };
        } else {
            backgroundCheckItem = {
                vehicleReportRequired: form.item(0).checked,
                driverLicenseNumber: "",
                commercialDriverLicense: false,
                licenseState: null,
                licenseExpiration: null,
                signature: this.state.signature,
                date: this.formatDate(new Date().toISOString()),
            };
        }


        this.insertBackgroundCheck(JSON.stringify(backgroundCheckItem));

    };

    externalSetState = (updateData, callback = () => { }) => {
        this.setState(updateData, _ => callback());
    }

    componentWillMount() {
        this.setState({
            loadingApplicantData: true,
            userId: localStorage.getItem('LoginId') || 0
        }, () => {
            this.getDocumentType();
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.applicationId != this.props.applicationId) {
            this.setState({
                applicationId: nextProps.applicationId
            });
        }
    }

    cloneForm = _ => {
        let contentPDF = document.getElementById('DocumentPDF');
        let contentPDFClone = contentPDF.cloneNode(true);
        return `<html style="zoom: 60%; font-family: 'Times New Roman'; line-height: 1.5;">${contentPDFClone.innerHTML}</html>`;
    }

    createDocumentsPDF = (random, download = false) => {
        this.setState({ downloading: true });
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: this.cloneForm(),
                    Name: "background-check-" + random
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.createdocumentspdf !== null) {
                    this.setState({
                        urlPDF: data.createdocumentspdf,
                        loadingData: false,
                        downloading: false
                    }, () => {
                        this.updatePdfUrlBackgroundCheck();
                        if (download) this.downloadDocumentsHandler();
                    });
                }
                else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: createdocumentspdf not exists in query data'
                    );
                    this.setState({
                        loadingData: false,
                        downloading: false
                    });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                this.setState({ loadingData: false, downloading: false });
            });
    };


    downloadDocumentsHandler = () => {
        var url = this.state.urlPDF; //this.context.baseUrl + '/public/Documents/' + "background-check-" + random + '.pdf';
        window.open(url, '_blank');
    };

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    handlePdfDownload = () => {
        if (this.state.urlPDF) {
            this.downloadDocumentsHandler();
        }
        else {
            let random = uuidv4();
            this.createDocumentsPDF(random, true);
        }
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
            <div className="Apply-container--application" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[13].label}</span>
                                <div>
                                    {
                                        this.state.isCreated && !this.state.loadingApplicantData ? (
                                            <button className="applicant-card__edit-button" onClick={this.handlePdfDownload}>
                                                {this.state.downloading && (
                                                    <React.Fragment>Downloading <i
                                                        className="fas fa-spinner fa-spin" /></React.Fragment>)}
                                                {!this.state.downloading && (
                                                    <React.Fragment>{spanishActions[9].label} <i
                                                        className="fas fa-download" /></React.Fragment>)}

                                            </button>
                                        ) : (
                                                ''
                                            )
                                    }
                                    {
                                        this.state.editing ? (
                                            <button
                                                className="applicant-card__edit-button ml-2" onClick={() => {
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

                            <div className="row" id="" style={{ margin: '0 auto', maxWidth: '100%' }}>
                                <div className="col-md-12">
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
                                    <div className="col-md-12 form-section-1 loading-container">
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
                                                <div class="input-group flex-nowrap">
                                                    <DatePicker
                                                        id="licenseExpiration"
                                                        name="licenseExpiration"
                                                        selected={this.state.licenseExpiration}
                                                        //onChange={this.handlelicenseExpirationDate}
                                                        onChange={(date) => {
                                                            this.setState({
                                                                licenseExpiration: date
                                                            })
                                                        }}
                                                        placeholderText={backgroundCheckJson[3].label}
                                                        disabled={this.state.editing || !this.state.vehicleReportRequired}
                                                    />
                                                    <div class="input-group-append">
                                                        <label class="input-group-text" id="addon-wrapping" for="injuryDate">
                                                            <i class="far fa-calendar"></i>
                                                        </label>
                                                    </div>
                                                </div>
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
                                <div className="col-md-12">
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
                            <div style={{
                                position: 'relative', display: 'none', width: '100%',
                                margin: 'auto'
                            }}>
                                <div className="row" id="DocumentPDF" style={{ maxWidth: '100%', margin: '0' }}>
                                    <Document
                                        setState={this.externalSetState}
                                        data={{
                                            firstName: this.state.firstName,
                                            middleName: this.state.middleName,
                                            lastName: this.state.lastName,
                                            birthDay: this.formatDate(this.state.birthDay, true),
                                            streetAddress: this.state.streetAddress,
                                            cityName: this.state.cityName,
                                            stateName: this.state.stateName,
                                            zipCode: this.state.zipCode,
                                            socialSecurityNumber: this.state.socialSecurityNumber,
                                            vehicleReportRequired: this.state.vehicleReportRequired,
                                            driverLicenseNumber: this.state.driverLicenseNumber,
                                            licenseStateName: this.state.licenseStateName,
                                            licenseExpiration: this.formatDate(this.state.licenseExpiration),
                                            commercialDriverLicense: this.state.commercialDriverLicense,
                                            signature: this.state.signature,
                                        }}
                                    />
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


    static contextTypes = {
        baseUrl: PropTypes.string
    };

    static contextTypes = {
        baseUrl: PropTypes.string
    };
}

export default withApollo(withMobileDialog()(withGlobalContent(BackgroundCheck)));