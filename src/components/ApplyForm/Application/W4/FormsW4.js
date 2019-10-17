import React, { Component, Fragment } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import { CREATE_DOCUMENTS_PDF_QUERY, GET_APPLICANT_INFO, GET_GENERAL_INFO } from "./Queries";
import { ADD_W4 } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';
import w4_form_english from './w4_header_eng.png';
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import FeatureTag from '../../../ui-components/FeatureTag';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class FormsW4 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signature: '',
            openSignature: false,
            id: null,
            content: '',
            date: '',
            applicantName: '',
            companyPhoneNumber: '',
            ApplicationId: this.props.applicationId,
            isCreated: null,
            html: '',

            // FORM Fields
            firstName: '',
            lastName: '',
            socialSecurityNumber: '',
            idNumber: '',
            firstEmployeeDate: '',
            employeer: '',
            excention: '',
            payCheck: '',
            excentionYear: '',
            address: '',
            postalCode: '',
            socialSecurityExtention: false,

            estadoCivil: false,
            estadoCivil1: false,
            estadoCivil2: false,
            urlPDF: '',
            formData: '',
            showReadOnlyFields: localStorage.getItem('IdRoles') == 13
        }
    }


    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: new Date().toISOString().substring(0, 10)
        }, () => {
            this.validateW4();
        });
    };

    cloneForm = _ => {
        let contentPDF = document.getElementById('w4Html');
        let contentPDFClone = contentPDF.cloneNode(true);

        return `<html style="zoom: 65%;">${contentPDFClone.innerHTML}</html>`;
    }

    getApplicantInformation = (id) => {
        this.props.client
            .query({
                query: GET_APPLICANT_INFO,
                variables: {
                    ApplicationId: id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applicantW4.length > 0) {
                    let fd = data.applicantW4[0].fieldsData;
                    this.setState({
                        isCreated: true,
                        html: data.applicantW4[0].html ? data.applicantW4[0].html.replace('style="zoom: 65%;"', '') : '',
                        urlPDF: data.applicantW4[0].url,
                        formData: fd ? JSON.parse(fd) : {}
                    }, _ => {
                        this.loadDataFromJson(this.state.formData)
                    });
                } else {
                    this.setState({
                        isCreated: false,
                    })
                }

                this.fetchApplicantInfo();
            })
            .catch(error => {
                console.log(error);
            })
    };

    fetchApplicantInfo = _ => {
        this.props.client.query({
            query: GET_GENERAL_INFO,
            variables: { id: this.props.applicationId }
        })
        .then(({data: {applications: [applicant]}}) => {

            const {firstName, lastName, socialSecurityNumber, streetAddress: address, zipCode, cityInfo: {Name: city}, stateInfo: {Name: state}, marital, exemptions} =  applicant;

            this.setState(_ => ({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                socialSecurityNumber,
                address: address.trim(),
                postalCode: `${city.trim()}, ${state.trim()}; ${zipCode}`,
                estadoCivil: (marital && marital === 1 && !this.state.estadoCivil2) ? true : false,
                estadoCivil1: (marital && marital === 2 && !this.state.estadoCivil2) ? true : false,
                excention: exemptions || 0
            }));
        })
        .catch(error => {
            console.log(error);
        })
    }

    loadDataFromJson = fieldsData => {
        if(!fieldsData) return;
        const { idNumber, firstEmployeeDate, employeer, payCheck, excentionYear, sse, signature, estadoCivil, estadoCivil1, estadoCivil2 } = fieldsData;

        this.setState(_ => ({
            idNumber,
            firstEmployeeDate,
            employeer,            
            payCheck,
            excentionYear,
            socialSecurityExtention: sse,
            signature,
            estadoCivil, estadoCivil1, estadoCivil2
        }));
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
                    contentHTML: this.cloneForm(),
                    Name: "W4-" + random + this.state.applicantName
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


    downloadDocumentsHandler = () => {
        var url = this.state.urlPDF; //this.context.baseUrl + this.state.urlPDF.replace(".", "");
        if(url)
            window.open(url, '_blank');
        else
            this.props.handleOpenSnackbar(
                'error',
                'Error to open W4 document.',
                'bottom',
                'right'
            );
        this.setState({ downloading: false });
    };

    componentWillMount() {
        this.getApplicantInformation(this.props.applicationId); 
    }

    validateW4 = () => {
        let firstNameField = document.getElementById('firstName');
        let lastNameField = document.getElementById('lastName');
        let socialSecurityNumberField = document.getElementById('socialSecurityNumber');

        if (firstNameField.value.length > 0 &&
            lastNameField.value.length > 0 &&
            socialSecurityNumberField.value.length > 0) {

            const html = this.cloneForm();

            const { firstName, lastName, socialSecurityNumber: ssn, idNumber, firstEmployeeDate, employeer, excention, payCheck, excentionYear, address, postalCode, socialSecurityExtention: sse, signature, estadoCivil, estadoCivil1, estadoCivil2 } = this.state;
            const jsonFields = JSON.stringify({ firstName, lastName, ssn, idNumber, firstEmployeeDate, employeer, excention, payCheck, excentionYear, address, postalCode, sse, signature, estadoCivil, estadoCivil1, estadoCivil2 });

            this.props.client
                .mutate({
                    mutation: ADD_W4,
                    variables: {
                        html,
                        ApplicantId: this.props.applicationId,
                        json: jsonFields
                    }
                })
                .then(() => {
                    this.props.handleOpenSnackbar(
                        'success',
                        this.state.html ? 'Updated Successfully' : 'Created Successfully',
                        'bottom',
                        'right'
                    );
                    this.getApplicantInformation(this.props.applicationId)
                    this.props.changeTabState();
                })
                .catch(error => {
                    // If there's an error show a snackbar with a error message
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save W4. Please, try again!',
                        'bottom',
                        'right'
                    );

                    console.log(error);
                });
        } else {
            // TODO: show a snackbar
            this.props.handleOpenSnackbar(
                'warning',
                'Complete all the fields and try again!',
                'bottom',
                'right'
            );
        }
    };

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.applicationId != this.props.applicationId) {
            this.setState({
                applicationId: nextProps.applicationId
            });
        }
    }

    render() {
        let renderSignatureDialog = () => (
            <div>
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
                        <h1 className="primary apply-form-container__label">Please Sign</h1>
                        <Button color="default" onClick={() => {
                            this.setState(() => ({ openSignature: false }),
                                () => {
                                    if (this.state.signature === '') {
                                        this.setState({
                                            accept: false
                                        })
                                    }
                                });
                        }}>
                            Close
                                </Button>
                    </Toolbar>
                    <DialogContent>
                        <SignatureForm
                            applicationId={this.state.applicationId}
                            signatureValue={this.handleSignature}
                            showSaveIcon={null}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );

        return (
            <div className="Apply-container--application" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[10].label}</span>
                                
                                                <Fragment>
                                                    <button style={{marginLeft: 'auto', marginRight: '8px'}} className="applicant-card__edit-button" onClick={() => {
                                                       this.setState(_ => ({
                                                           openSignature: true
                                                       }))
                                                    }}>
                                                        Sign <i className="fas fa-pencil-alt" />
                                                    </button>
                                                    <button className="applicant-card__edit-button" style={{marginRight: '8px'}} onClick={this.downloadDocumentsHandler}>
                                                        {this.state.downloading && (
                                                        <React.Fragment>Downloading <i
                                                            class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                                        {!this.state.downloading && (
                                                            <React.Fragment>{actions[9].label} <i
                                                                className="fas fa-download" /></React.Fragment>)}
                                                </button>
                                            </Fragment>
                                       
                                                <button className="applicant-card__edit-button" onClick={() => {
                                                    this.validateW4();
                                                }}>{actions[4].label} <i className="far fa-save" />
                                                </button>
                                           
                            </div>
                            {
                                (
                                    <div style={{ width: '100%', margin: '0 auto' }}>
                                        <div className="row pdf-container" id="w4Html" style={{ maxWidth: '100%' }}>
                                            <div id="DocumentPDF" className="signature-information">
                                                {
                                                    localStorage.getItem('languageForm') == 'es' ? (
                                                        <div>
                                                            <table style={{
                                                                fontFamily: 'Times New Roman',
                                                                fontSize: '11px',
                                                                border: '0px #FFF',
                                                                borderCollapse: 'collapse',
                                                                width: '100%',
                                                                borderTop: '1px solid black'
                                                            }} cellspacing={1}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{ lineHeight: "1.5", width: '50%', verticalAlign: 'top', padding: '8px 24px', paddingLeft: '0px' }}>
                                                                            <h2 style={{ width: '100%', borderBottom: '2px solid black' }}>Formulario W-4(SP) (2019)</h2>
                                                                            <p>
                                                                                <span style={{ fontWeight: '900' }}>Acontecimientos futuros.</span> Toda información sobre acontecimientos futuros que afecten al Formulario W-4(SP) (como legislación aprobada después de
                                                                                que el formulario ha sido publicado) será anunciada en <a href="www.irs.gov/FormW4SP.Prop">www.irs.gov/FormW4SP.</a>
                                                                            </p>
                                                                            <p>
                                                                                <span style={{ fontWeight: '900' }}>Propósito.</span> Complete el Formulario W-4(SP) para que su empleador
                                                                                pueda retener la cantidad correcta del impuesto federal sobre los ingresos de su paga. Considere completar un nuevo
                                                                                Formulario W-4(SP) cada año y cuando su situación personal o financiera cambie.
                                                                            </p>
                                                                            <p>
                                                                                <span style={{ fontWeight: '900' }}>Exención de la retención.</span> Puede reclamar la exención de la retención
                                                                                para 2019 si <span style={{ fontWeight: '900' }}>ambas</span> de las siguientes situaciones le corresponde:
                                                                            </p>
                                                                            <p>
                                                                                • Para 2018 tenía derecho a un reembolso de <span style={{ fontWeight: '900' }}>todo</span> el impuesto federal sobre los ingresos
                                                                                retenido porque <span style={{ fontWeight: '900' }}>no</span> tenía obligación tributaria <span style={{ fontWeight: '900' }}>y</span>
                                                                            </p>
                                                                            <p>
                                                                                • Para 2019 espera un reembolso de <span style={{ fontWeight: '900' }}>todo</span> el impuesto
                                                                                federal
                                                                                sobre ingreso retenido porque
                                                                                usted
                                                                                espera notener obligación tributaria.
                                                                            </p>
                                                                            <p>
                                                                                Si está exento, complete <span style={{ fontWeight: '900' }}>sólo</span> las líneas <span style={{ fontWeight: '900' }}>1,2,3,4 y 7</span> y firme
                                                                                el
                                                                                formulario
                                                                                para validarlo. Su exención para 2019 vence el 17 de
                                                                                febrero
                                                                                de 2020. Vea la
                                                                                Publicación 505, Tax Withholding and Estimated Tax
                                                                                (Retención de impuestos e
                                                                                impuesto estimado), en inglés, para saber más sobre
                                                                                si reúne
                                                                                los
                                                                                requisitos
                                                                                para la exención de la retención.
                                                                            </p>
                                                                            <h4>Instrucciones Generales</h4>
                                                                            <p>Si no está exento, siga el resto de estas instrucciones
                                                                                para
                                                                                determinar el número
                                                                                de
                                                                                retenciones que debe reclamar para propósitos de la
                                                                                retención
                                                                                para 2019 y
                                                                                cualquier
                                                                                cantidad adicional de impuestos a ser retenida. Para los
                                                                                salarios normales, la retención
                                                                                tiene que basarse en los descuentos que reclamó y no
                                                                                puede ser
                                                                                una cantidad fija ni un
                                                                                porcentaje de los salarios.</p>
                                                                            <p>También puede usar la calculadora
                                                                                en <span style={{ fontWeight: '900' }}>
                                                                                    <a href="www.irs.gov/W4AppSP">www.irs.gov/W4AppSP</a>
                                                                                </span> para
                                                                                determinar su retención de impuestos con mayor
                                                                                precisión.
                                                                                Considere usar esta
                                                                                calculadora si</p>
                                                                        </td>
                                                                        <td style={{ lineHeight: "1.5", width: '49.9468%', verticalAlign: 'top', padding: '8px 24px' }}>
                                                                            <p style={{ marginBottom: "0", textAlign: 'left' }}>
                                                                                tiene una situación
                                                                                tributaria más
                                                                                complicada, como por
                                                                                ejemplo, si tiene un cónyuge que trabaja, si tiene más
                                                                                de un
                                                                                trabajo o tiene una
                                                                                cantidad alta de ingresos no derivados del trabajo no
                                                                                sujetos a
                                                                                retención aparte de su
                                                                                trabajo. Después de que su Formulario W-4(SP) entre en
                                                                                vigencia,
                                                                                también puede
                                                                                usar
                                                                                esta calculadora para ver cómo la cantidad de impuestos
                                                                                que
                                                                                tiene retenida se compara con
                                                                                su
                                                                                impuesto total previsto para 2019. Si usa la
                                                                                calculadora, no
                                                                                necesita completar ninguna de las
                                                                                hojas
                                                                                de trabajo para el Formulario W-4(SP).</p>
                                                                            <p style={{ marginBottom: "0", textAlign: 'left' }}>Tenga en cuenta que si
                                                                               retiene
                                                                               demasiados impuestos recibirá un
                                                                               reembolso cuando presente su declaración de impuestos.
                                                                               Si no
                                                                               retiene suficientes
                                                                               impuestos,
                                                                               adeudará impuestos cuando presente su declaración de
                                                                               impuestos y
                                                                               podría
                                                                               estar
                                                                                sujeto a una multa.</p>
                                                                            <p style={{ marginBottom: "0", textAlign: 'left' }}>
                                                                                <span style={{ fontWeight: '900' }}>
                                                                                    Personas con múltiples
                                                                                    trabajos o con
                                                                                    cónyuges que
                                                                                    trabajan.
                                                                                </span> Si tiene más de un trabajo a la vez, o si es casado que
                                                                                presenta
                                                                                una declaración
                                                                                conjunta y su cónyuge trabaja, lea todas las
                                                                                instrucciones,
                                                                                incluyendo las instrucciones
                                                                                para la <span style={{ fontWeight: '900' }}>
                                                                                    Hoja de Trabajo para Dos Asalariados o Múltiples
                                                                                    Empleos
                                                                                </span> antes de comenzar.</p>
                                                                            <p style={{ marginBottom: "0", textAlign: 'left' }}>
                                                                                <span style={{ fontWeight: '900' }}>Ingresos no derivados del trabajo.
                                                                                </span> Si
                                                                                tiene una cantidad alta de
                                                                                ingresos
                                                                                no derivados del trabajo no sujetos a retención, tales
                                                                                como
                                                                                intereses o dividendos,
                                                                                considere
                                                                                hacer pagos de impuestos estimados usando el Formulario
                                                                                1040-ES,
                                                                                Estimated Tax for Individuals
                                                                                (Impuesto estimado para personas físicas), en inglés. De
                                                                                lo
                                                                                contrario, puede
                                                                                adeudar
                                                                                impuestos adicionales. O bien, puede usar
                                                                                la <span style={{ fontWeight: '900' }}>Hoja de Trabajo para Deducciones,
                                                                                Ajustes e Ingreso Adicional </span> en
                                                                                la página <span style={{ fontWeight: '900' }}>4</span> o la calculadora en
                                                                                <a href="www.irs.gov/W4AppSP">www.irs.gov/W4AppSP</a> para
                                                                                asegurarse de tener suficientes
                                                                                impuestos retenidos de su cheque de paga. Si tiene
                                                                                ingresos por
                                                                                concepto de pensión o
                                                                                anualidad, vea la Publicación 505 o utilice la
                                                                                calculadora en <a
                                                                                    href="www.irs.gov/W4AppSP">www.irs.gov/W4AppSP</a> para
                                                                            saber si tiene que ajustar su
                                                                            retención en el Formulario W-4(SP) o el Formulario W-4P,
                                                                            en
                                                                                inglés.</p>
                                                                            <p style={{ marginBottom: "0", textAlign: 'left' }}>
                                                                                <span style={{ fontWeight: '900' }}>Extranjero no residente.</span> Si
                                                                                es
                                                                                extranjero no residente, vea el Aviso
                                                                                1392,
                                                                                Supplemental Form W-4 Instructions for Nonresident
                                                                                Aliens
                                                                                (Instrucciones complementarias para el
                                                                                Formulario W-4 para extranjeros no residentes), en
                                                                                inglés, antes
                                                                                de completar este
                                                                                formulario.</p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                            <br />
                                                            <p><img src="https://i.imgur.com/wJ2ancW.png"
                                                                style={{ width: '100%' }} />
                                                            </p>
                                                            <table style={{ borderCollapse: 'collapse', width: '100%' }} border={1}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            width: '50%',
                                                                            verticalAlign: 'top'
                                                                        }}>
                                                                            1 Su primer nombre e inicial del segundo
                                                                            <input
                                                                                disabled={true}
                                                                                type="text"
                                                                                style={{ width: '100%', border: 0 }}
                                                                                id="firstName"
                                                                                value={this.state.firstName}
                                                                                onChange={(e) => {
                                                                                    this.setState({ firstName: e.target.value })
                                                                                }}
                                                                            />

                                                                        </td>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            width: '25%',
                                                                            verticalAlign: 'top'
                                                                        }}>
                                                                            Apellido
                                                                            <input
                                                                                disabled={true}
                                                                                type="text"
                                                                                style={{ width: '100%', border: 0 }}
                                                                                id="lastName"
                                                                                value={this.state.lastName}
                                                                                onChange={(e) => {
                                                                                    this.setState({ lastName: e.target.value })
                                                                                }}
                                                                            />
                                                                        </td>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            width: '25%',
                                                                            verticalAlign: 'top'
                                                                        }}>
                                                                            <span style={{ fontWeight: '900' }}>2 Su número de Seguro Social</span>
                                                                            <input
                                                                                disabled={true}
                                                                                type="text" style={{ width: '100%', border: 0 }}
                                                                                id="socialSecurityNumber"
                                                                                value={this.state.socialSecurityNumber}
                                                                                onChange={(e) => {
                                                                                    this.setState({ socialSecurityNumber: e.target.value })
                                                                                }}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr style={{ height: '34px' }}>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            verticalAlign: 'top',
                                                                            width: '50%',
                                                                            borderTop: '0px #ffffff',
                                                                            height: '34px'
                                                                        }}
                                                                            colSpan="1">
                                                                            <div data-font-name="g_d8_f3" data-angle={0}
                                                                                data-canvas-width="218.47000000000006">Dirección (número de casa y calle o ruta rural)
                                                                                <input
                                                                                    disabled={true}
                                                                                    type="text"
                                                                                    style={{ width: '100%', border: 0 }}
                                                                                    id="address"
                                                                                    value={this.state.address}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            address: e.target.value
                                                                                        })
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            width: '50%',
                                                                            borderTop: '0px #ffffff',
                                                                            height: '34px',
                                                                            fontFamily: 'Times New Roman',
                                                                            verticalAlign: 'top'
                                                                        }}
                                                                            colSpan="2">
                                                                            <div data-font-name="g_d8_f2" data-angle={0}
                                                                                data-canvas-width="408.9536499999999">
                                                                                3. <input
                                                                                    type="radio"
                                                                                    name="estadoCivil"
                                                                                    value={this.state.estadoCivil}
                                                                                    defaultChecked={this.state.estadoCivil}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            estadoCivil: e.target.checked,
                                                                                            estadoCivil1: false,
                                                                                            estadoCivil2: false,
                                                                                        })
                                                                                    }}
                                                                                /> Soltero
                                                                                <input
                                                                                    type="radio"
                                                                                    name="estadoCivil"
                                                                                    value={this.state.estadoCivil1}
                                                                                    defaultChecked={this.state.estadoCivil1}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            estadoCivil1: e.target.checked,
                                                                                            estadoCivil: false,
                                                                                            estadoCivil2: false,
                                                                                        })
                                                                                    }}
                                                                                /> Casado
                                                                                <input
                                                                                    type="radio"
                                                                                    name="estadoCivil"
                                                                                    value={this.state.estadoCivil2}
                                                                                    defaultChecked={this.state.estadoCivil2}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            estadoCivil2: e.target.checked,
                                                                                            estadoCivil: false,
                                                                                            estadoCivil1: false,
                                                                                        })
                                                                                    }}
                                                                                /> Casado, pero retiene con la tasa mayor de Soltero
                                                                                <span style={{ fontWeight: '900' }}>Nota: </span> Si es casado, pero está legalmente separado, marque el recuadro “Casado, pero retiene con la tasa mayor de Soltero”.
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr style={{ height: '34px' }}>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            verticalAlign: 'top',
                                                                            width: '50%',
                                                                            borderTop: '0px #ffffff',
                                                                            height: '34px'
                                                                        }}
                                                                            colSpan="1">
                                                                            <div data-font-name="g_d8_f3" data-angle={0}
                                                                                data-canvas-width="218.47000000000006">Ciudad o pueblo,
                                                                               estado y código postal (ZIP)
                                                                                <input
                                                                                    disabled={true}
                                                                                    type="text"
                                                                                    style={{ width: '100%', border: 0 }}
                                                                                    id="postalCode"
                                                                                    value={this.state.postalCode}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            postalCode: e.target.value
                                                                                        })
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            width: '50%',
                                                                            borderTop: '0px #ffffff',
                                                                            height: '34px',
                                                                            fontFamily: 'Times New Roman',
                                                                            verticalAlign: 'top'
                                                                        }}
                                                                            colSpan="2">
                                                                            <div data-font-name="g_d8_f2" data-angle={0}
                                                                                data-canvas-width="408.9536499999999">
                                                                                <span style={{ fontWeight: '900' }}>
                                                                                    4 Si su
                                                                                    apellido es distinto al que aparece en su tarjeta de
                                                                                    Seguro
                                                                                    Social, marque este recuadro.
                                                                                    Debe llamar al 800-772-1213 para recibir una tarjeta de
                                                                                    reemplazo. ▶
                                                                                </span>
                                                                                <input
                                                                                    //disabled={this.state.isCreated}
                                                                                    type="checkbox"
                                                                                    id="socialSecurityExtention"
                                                                                    value={this.state.socialSecurityExtention}
                                                                                    defaultChecked={this.state.socialSecurityExtention}
                                                                                    onClick={(e) => {
                                                                                        this.setState({ socialSecurityExtention: e.target.checked })
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table style={{ borderCollapse: 'collapse', width: '100%', borderTop: 0 }}
                                                                border={1}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            verticalAlign: 'top',
                                                                            width: '100%'
                                                                        }}>
                                                                            5 Número total de exenciones que reclama (de la hoja de
                                                                            trabajo que
                                                                            le corresponda en las
                                                                            siguientes páginas)
                                                                            6 Cantidad adicional, si la hay, que desea que se le retenga
                                                                            de cada
                                                                            cheque de paga
                                                                            7 Reclamo exención de la retención para 2019 y certifico que
                                                                            cumplo con <span style={{ fontWeight: '900' }}>ambas</span> condiciones,
                                                                            a continuación, para la
                                                                            exención:
                                                                            • El año pasado tuve derecho a un reembolso
                                                                            de <span style={{ fontWeight: '900' }}>todos</span> los
                                                                            impuestos federales sobre el ingreso retenidos
                                                                            porque no
                                                                            tuve obligación tributaria alguna y
                                                                            • Este año tengo previsto un reembolso
                                                                            de <span style={{ fontWeight: '900' }}>todos</span> los
                                                                            impuestos
                                                                            federales sobre los ingresos retenidos porque tengo
                                                                            previsto
                                                                            no tener una obligación tributaria
                                                                            Si cumple con ambas condiciones, escriba “Exempt” (Exento)
                                                                            aquí
                                                                        </td>
                                                                        <td style={{ lineHeight: "1.5", verticalAlign: 'top', borderCollapse: 'collapse' }}>
                                                                            <table style={{ borderCollapse: 'collapse' }}>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style={{
                                                                                            lineHeight: "1.5",
                                                                                            verticalAlign: 'top',
                                                                                            borderCollapse: 'collapse',
                                                                                            borderBottom: 'solid 1px #000',

                                                                                        }}>
                                                                                            5
                                                                                    </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{
                                                                                            lineHeight: "1.5",
                                                                                            verticalAlign: 'top',
                                                                                            borderCollapse: 'collapse',
                                                                                            borderBottom: 'solid 1px #000'
                                                                                        }}>6
                                                                                    </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{
                                                                                            lineHeight: "1.5",
                                                                                            verticalAlign: 'top',
                                                                                            height: '68px',
                                                                                            background: '#CCC',
                                                                                            borderCollapse: 'collapse',
                                                                                            borderBottom: 'solid 1px #000'
                                                                                        }} />
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{
                                                                                            lineHeight: "1.5",
                                                                                            verticalAlign: 'top',
                                                                                            borderCollapse: 'collapse'
                                                                                        }}>7
                                                                                    </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td style={{ lineHeight: "1.5", verticalAlign: 'top', borderCollapse: 'collapse' }}>
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style={{
                                                                                            lineHeight: "1.5",
                                                                                            verticalAlign: 'top',
                                                                                            borderCollapse: 'collapse',
                                                                                            borderBottom: 'solid 1px #000'
                                                                                        }}>
                                                                                            <input
                                                                                                //disabled={this.state.isCreated}
                                                                                                type="text"
                                                                                                style={{ border: 0, height: '16.5px' }}
                                                                                                id="excention"
                                                                                                value={this.state.excention}
                                                                                                onChange={(e) => {
                                                                                                    this.setState({ excention: e.target.value })
                                                                                                }}
                                                                                            />
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{
                                                                                            lineHeight: "1.5",
                                                                                            verticalAlign: 'top',
                                                                                            borderCollapse: 'collapse',
                                                                                            borderBottom: 'solid 1px #000'
                                                                                        }}>
                                                                                            <input
                                                                                                //disabled={this.state.isCreated}
                                                                                                type="text"
                                                                                                style={{ border: 0, height: '16.5px' }}
                                                                                                id="payCheck"
                                                                                                value={this.state.payCheck}
                                                                                                onChange={(e) => {
                                                                                                    this.setState({ payCheck: e.target.value })
                                                                                                }}
                                                                                            />
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{
                                                                                            lineHeight: "1.5",
                                                                                            verticalAlign: 'top',
                                                                                            height: '66px',
                                                                                            background: '#CCC',
                                                                                            borderCollapse: 'collapse',
                                                                                            borderBottom: 'solid 1px #000'
                                                                                        }} />
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td style={{ lineHeight: "1.5", verticalAlign: 'top' }}>
                                                                                            <input
                                                                                                //disabled={this.state.isCreated}
                                                                                                type="text"
                                                                                                style={{ border: 0, height: '16.5px' }}
                                                                                                id="excention-year"
                                                                                                value={this.state.excentionYear}
                                                                                                onChange={(e) => {
                                                                                                    // console.log(e.target.value);
                                                                                                    this.setState({ excentionYear: e.target.value })
                                                                                                }}
                                                                                            />
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan="3">
                                                                            Bajo pena de perjurio, declaro haber examinado este certificado y que a mi leal saber y entender, es verídico, correcto y completo.
                                                                            <span style={{ fontWeight: '900' }}>Firma del empleado</span>
                                                                            (Este formulario no es válido a menos que usted lo firme).  ▶
                                                                            <img src={this.state.signature}
                                                                                style={{
                                                                                    width: '100px',
                                                                                    height: '30px',
                                                                                    display: 'inline-block',
                                                                                    backgroundColor: '#f9f9f9',
                                                                                    // cursor: 'pointer'
                                                                                }} onClick={() => {
                                                                                    // if(this.state.isCreated === false){
                                                                                    //     this.setState({
                                                                                    //         openSignature: true,
                                                                                    //     })
                                                                                    // }
                                                                                }}
                                                                                alt="" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Fecha  ▶ {new Date().toDateString()}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                           
                                                            <table style={{ borderCollapse: 'collapse', width: '100%' }} border={1}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            width: '65%',
                                                                            verticalAlign: 'top'
                                                                        }}>
                                                                            8 Nombre y dirección del empleador (<span style={{ fontWeight: '900' }}>Empleador:</span> Complete
                                                                            las líneas <span style={{ fontWeight: '900' }}>8 y 10</span> si
                                                                            envía este
                                                                            certificado
                                                                            alIRS y complete las
                                                                            líneas <span style={{ fontWeight: '900' }}>8, 9 y 10</span> si
                                                                            lo envía al State
                                                                            Directory
                                                                            of New Hires
                                                                            (Directorio
                                                                            estatal de personas recién empleadas).
                                                                            {this.state.showReadOnlyFields ? (
                                                                                <label 
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html: `${this.state.employeer}`
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <input
                                                                                    //disabled={this.state.isCreated}
                                                                                    type="text" style={{ width: '100%', border: 0 }}
                                                                                    id="employeer"
                                                                                    value={this.state.employeer}
                                                                                    onChange={(e) => {
                                                                                        this.setState({ employeer: e.target.value })
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            width: '15%',
                                                                            verticalAlign: 'top'
                                                                        }}>
                                                                            9 Primera fecha de empleo
                                                                            {this.state.showReadOnlyFields ? (
                                                                                <label 
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html: `${this.state.firstEmployeeDate}`
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <input
                                                                                //disabled={this.state.isCreated}
                                                                                type="text"
                                                                                style={{ width: '100%', border: 0, height: '65px' }}
                                                                                id="firstEmployeeDate"
                                                                                value={this.state.firstEmployeeDate}
                                                                                onChange={(e) => {
                                                                                    this.setState({ firstEmployeeDate: e.target.value })
                                                                                }}
                                                                            />
                                                                            )}                                                                            
                                                                        </td>
                                                                        <td style={{
                                                                            lineHeight: "1.5",
                                                                            fontSize: '11px',
                                                                            fontFamily: 'Times New Roman',
                                                                            width: '20%',
                                                                            verticalAlign: 'top'
                                                                        }}>
                                                                            10 Número de identificación del empleador(EIN)
                                                                            {this.state.showReadOnlyFields ? (
                                                                                <label 
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html: `${this.state.idNumber}`
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <input
                                                                                    //disabled={this.state.isCreated}
                                                                                    type="text"
                                                                                    style={{ width: '100%', border: 0, height: '65px' }}
                                                                                    id="idNumber"
                                                                                    value={this.state.idNumber}
                                                                                    onChange={(e) => {
                                                                                        this.setState({ idNumber: e.target.value })
                                                                                    }}                                                                                
                                                                                />
                                                                            )}           
                                                                            
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <p>&nbsp;</p>
                                                            <table style={{
                                                                borderCollapse: 'collapse',
                                                                border: '0px #FFF',
                                                                width: '100%',
                                                                fontFamily: 'Times New Roman',
                                                                fontSize: '11px'
                                                            }} >
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{ lineHeight: "1.5", width: '50%', verticalAlign: 'top', padding: '8px 24px', paddingRight: '0px' }}>
                                                                            <h3>Instrucciones Específicas.</h3>
                                                                            <h5>Hoja de Trabajo para Descuentos Personales</h5>
                                                                            <p>Complete esta
                                                                                hoja de
                                                                                trabajo en la
                                                                                página <span style={{ fontWeight: '900' }}>4</span> primero
                                                                                para determinar el número de descuentos
                                                                                personales de
                                                                                retención que debe
                                                                                reclamar.</p>
                                                                            <p>
                                                                                <span style={{ fontWeight: '900' }}>Línea C. Cabeza de familia, tenga en cuenta:</span> Por
                                                                                lo general, usted
                                                                                podría reclamar el estado de cabeza de familia para
                                                                                efectos de
                                                                                la declaración de
                                                                                impuestos sólo si no está casado y paga más del 50% de
                                                                                los
                                                                                costos de
                                                                                mantener
                                                                                el hogar para usted y otro individuo calificado. Vea la
                                                                                Publicación 501, en
                                                                                inglés,
                                                                                para más información acerca del estado civil para
                                                                                efectos de la
                                                                                declaración.
                                                                            </p>
                                                                            <p>
                                                                                <span style={{ fontWeight: '900' }}>Línea E. Crédito tributario por hijos.</span> Cuando
                                                                                presente su
                                                                                declaración de
                                                                                impuestos, usted podría reunir los requisitos para
                                                                                reclamar el
                                                                                crédito tributario
                                                                                por
                                                                                hijos por cada uno de sus hijos calificados. Para ser
                                                                                considerado hijo calificado, el hijo tiene
                                                                                que
                                                                                ser menor de 17 años de edad a partir del 31 de
                                                                                diciembre, tiene
                                                                                que ser su dependiente
                                                                                que
                                                                                viva con usted por más de la mitad del año y tiene que
                                                                                tener un
                                                                                número de
                                                                                Seguro Social válido. Para obtener más información
                                                                                acerca de
                                                                                este
                                                                                crédito, consulte la Publicación 972, Child Tax Credit
                                                                                (Crédito
                                                                                tributario
                                                                                por
                                                                                hijos), en inglés. Para reducir el impuesto retenido de
                                                                                su paga
                                                                                teniendo en cuenta este
                                                                                crédito, siga las instrucciones en la línea E de la hoja
                                                                                de
                                                                                trabajo. En la hoja de
                                                                                trabajo se le preguntará acerca de su ingreso total.
                                                                                Para este
                                                                                propósito, el
                                                                                ingreso
                                                                                total incluye todos sus salarios y otros ingresos,
                                                                                incluyendo
                                                                                los ingresos obtenidos por un
                                                                                cónyuge si presenta una declaración conjunta.</p>
                                                                            <p>
                                                                                <span style={{ fontWeight: '900' }}>Línea F. Crédito para otros dependientes.</span> Cuando
                                                                                presente su
                                                                                declaración de impuestos, usted podría reunir los
                                                                                requisitos
                                                                                para reclamar un
                                                                                crédito por otros dependientes por los cuales no se
                                                                                puede
                                                                                reclamar un crédito
                                                                                tributario por hijos, tal como un hijo calificado que no
                                                                                cumple
                                                                                con el requisito de edad o de
                                                                                tener
                                                                                un número de Seguro Social para el crédito tributario
                                                                                por hijos
                                                                                o tal como un
                                                                                pariente
                                                                                calificado. Para obtener más información sobre este
                                                                                crédito,
                                                                                consulte la
                                                                                Publicación 972, en inglés.</p>
                                                                        </td>
                                                                        <td style={{ lineHeight: "1.5", width: '50%', verticalAlign: 'top', padding: '8px 24px', paddingLeft: '0px' }}>
                                                                            <p>Para reducir el impuesto retenido de su paga teniendo en
                                                                                cuenta
                                                                                este crédito, siga las
                                                                                instrucciones en la línea F de la hoja de trabajo. En la
                                                                                hoja de
                                                                                trabajo, se le
                                                                                preguntará acerca de su ingreso total. Para este
                                                                                propósito, el
                                                                                ingreso total
                                                                                incluye
                                                                                todos sus salarios y otros ingresos, incluyendo los
                                                                                ingresos
                                                                                obtenidos por un cónyuge si
                                                                                presenta una declaración conjunta.</p>
                                                                            <p>
                                                                                <span style={{ fontWeight: '900' }}>Línea G. Otros créditos.</span> Usted
                                                                                podría reducir el
                                                                                impuesto
                                                                                retenido de su cheque de paga si espera reclamar otros
                                                                                créditos
                                                                                tributarios, tales como
                                                                                los
                                                                                créditos tributarios por estudios (vea la Publicación
                                                                                970, en
                                                                                inglés). Si
                                                                                lo
                                                                                hace, su cheque de paga será mayor, pero la cantidad de
                                                                                cualquier reembolso que reciba
                                                                                cuando
                                                                                presente su declaración de impuestos será menor. Siga
                                                                                las
                                                                                instrucciones para la
                                                                                Hoja
                                                                                de Trabajo 1-6 en la Publicación 505, en inglés, si
                                                                                desea
                                                                                reducir su
                                                                                retención
                                                                                para tener en cuenta estos créditos. Si usa la Hoja de
                                                                                Trabajo
                                                                                1-6, anote
                                                                                “-0-”
                                                                                en las líneas <span style={{ fontWeight: '900' }}>E y F.</span> </p>
                                                                            <h3>Hoja de Trabajo para Deducciones, Ajustes e Ingreso Adicional</h3>
                                                                            <p>Complete esta hoja de trabajo para determinar si puede
                                                                                reducir
                                                                                los impuestos retenidos de su
                                                                                cheque
                                                                                de paga para contabilizar sus deducciones detalladas y
                                                                                otros
                                                                                ajustes a los ingresos, tales como
                                                                                las
                                                                                contribuciones a los arreglos IRA. Si lo hace, su
                                                                                reembolso al
                                                                                final del año será
                                                                                menor, pero su cheque de paga será más grande. No está
                                                                                obligado
                                                                                a completar
                                                                                esta hoja de trabajo ni a reducir su retención si no
                                                                                desea
                                                                                hacerlo.</p>
                                                                            <p>También puede usar esta hoja de trabajo para calcular por
                                                                                cuánto
                                                                                aumentar el
                                                                                impuesto
                                                                                retenido de su cheque de paga si tiene una cantidad alta
                                                                                de
                                                                                ingresos no derivados del trabajo no
                                                                                sujetos a retención, tales como intereses o
                                                                                dividendos.</p>
                                                                            <p>Otra opción es tomar estas partidas en cuenta y hacer que
                                                                                su
                                                                                retención sea
                                                                                más
                                                                                precisa al usar la calculadora en <a
                                                                                    href="www.irs.gov/W4AppSP.">www.irs.gov/W4AppSP.</a> Si
                                                                            usa
                                                                            la
                                                                            calculadora, no necesita completar ninguna de las hojas
                                                                            de
                                                                            trabajo para el Formulario W-4(SP).
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                            <div>
                                                                {/* <div style={}>

                                                                </div> */}
                                                                <table style={{
                                                                    fontFamily: 'Times New Roman',
                                                                    fontSize: '11px',
                                                                    border: '0px #FFF',
                                                                    borderCollapse: 'collapse',
                                                                    width: '100%',
                                                                    borderTop: '1px solid black'
                                                                }}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ lineHeight: "1.5", width: '33.33%', verticalAlign: 'top', padding: '8px 24px', paddingLeft: '0px' }}>
                                                                                <h2 style={{ width: '100%', borderBottom: '2px solid black' }}>Form W-4
                                                                                (2019) </h2>
                                                                                <p><span style={{ fontWeight: '900' }}>Future developments.</span> For the latest information about any future developments related to Form W-4, such as legislation enacted after it was published, go to www.irs.gov/FormW4.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Purpose.</span> Complete Form W-4 so that your employer can withhold the correct federal income tax from your pay. Consider completing a new Form W-4 each year and when your personal or financial situation changes.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Exemption from withholding.</span> You may claim exemption from withholding for 2019 if <span style={{ fontWeight: '900' }}>both</span> of the following apply.
                                                                            • For 2018 you had a right to a refund of <span style={{ fontWeight: '900' }}>all</span> federal income tax withheld because you had <span style={{ fontWeight: '900' }}>no</span> tax liability, <span style={{ fontWeight: '900' }}>and</span>
                                                                                    • For 2019 you expect a refund of <span style={{ fontWeight: '900' }}>all</span> federal income tax withheld because you expect to have <span style={{ fontWeight: '900' }}>no</span> tax liability.
                                                                                    If you’re exempt, complete only lines 1, 2, 3, 4, and 7 and sign the form to validate it. Your exemption for 2019 expires February 17, 2020.
                                                                            See Pub. 505, Tax Withholding and Estimated Tax, to learn more about whether you qualify for exemption from withholding.</p>
                                                                                <h4>General Instructions</h4>
                                                                                <p>If you aren’t exempt, follow the rest of these instructions to determine the number of withholding allowances you should claim for withholding for 2019 and any additional amount of tax to have withheld. For regular wages, withholding must be based on allowances you claimed and may not be a flat amount or percentage of wages. You can also use the calculator at <span style={{ fontWeight: '900' }}>www.irs.gov/W4App</span> to determine your tax withholding more accurately. Consider</p>
                                                                            </td>
                                                                            <td style={{ lineHeight: "1.5", width: '33.33%', verticalAlign: 'top', padding: '8px 24px' }}>
                                                                                <p style={{ marginBottom: "0", textAlign: 'left' }}>using this calculator if you have a more complicated tax situation, such as if you have a working spouse, more than one job, or a large amount of nonwage income not subject to withholding outside of your job. After your Form W-4 takes effect, you can also use this calculator to see how the amount of tax you’re having withheld compares to your projected total tax for 2019. If you use the calculator, you don’t need to complete any of the worksheets for Form W-4.</p>
                                                                                <p>Note that if you have too much tax withheld, you will receive a refund when you file your tax return. If you have too little tax withheld, you will owe tax when you file your tax return, and you might owe a penalty.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Filers with multiple jobs or working spouses.</span> If you have more than one job at a time, or if you’re married filing jointly and your spouse is also working, read all of the instructions including the instructions for the Two-Earners/Multiple Jobs Worksheet before beginning.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Nonwage income.</span> If you have a large amount of nonwage income not subject to withholding, such as interest or dividends, consider making estimated tax payments using Form 1040-ES, Estimated Tax for Individuals. Otherwise, you might owe additional tax. Or, you can use the Deductions, Adjustments, and Additional Income Worksheet on page 3 or the calculator at www.irs.gov/W4App to make sure you have enough tax withheld from your paycheck. If you have pension or annuity income, see Pub. 505 or use the calculator at www.irs.gov/W4App to find out if you should adjust your withholding on Form W-4 or W-4P.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Nonresident alien.</span> If you’re a nonresident alien, see Notice 1392, Supplemental Form W-4 Instructions for Nonresident Aliens, before completing this form.</p>
                                                                            </td>
                                                                            <td style={{ lineHeight: "1.5", width: '33.33%', verticalAlign: 'top', padding: '8px 24px', paddingRight: '0px' }}>
                                                                                <h4>Specific Instructions</h4>
                                                                                <p>
                                                                                    <h6><span style={{ fontWeight: '900' }}>Personal Allowances Worksheet</span></h6>
                                                                                    Complete this worksheet on page 3 first to determine the number of withholding allowances to claim.
                                                                            </p>
                                                                                <p><span style={{ fontWeight: '900' }}>Line C. Head of household please note: </span>Generally, you may claim head of household filing status on your tax return only if you’re unmarried and pay more than 50% of the costs of keeping up a home for yourself and a qualifying individual. See Pub. 501 for more information about filing status.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Line E. Child tax credit.</span> When you file your tax return, you may be eligible to claim a child tax credit for each of your eligible children. To qualify, the child must be under age 17 as of December 31, must be your dependent who lives with you for more than half the year, and must have a valid social security number. To learn more about this credit, see Pub. 972, Child Tax Credit. To reduce the tax withheld from your pay by taking this credit into account, follow the instructions on line E of the worksheet. On the worksheet you will be asked about your total income. For this purpose, total income includes all of your wages and other income, including income earned by a spouse if you are filing a joint return.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Line F. Credit for other dependents.</span> When you file your tax return, you may be eligible to claim a credit for other dependents for whom a child tax credit can’t be claimed, such as a qualifying child who doesn’t meet the age or social security number requirement for the child tax credit, or a qualifying relative. To learn more about this credit, see Pub. 972. To reduce the tax withheld from your pay by taking this credit into account, follow the instructions on line F of the worksheet. On the worksheet, you will be asked about your total income. For this purpose, total</p>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>

                                                                <br />
                                                                <p><img src={w4_form_english} style={{ width: '100%' }} />
                                                                </p>
                                                                <table style={{ borderCollapse: 'collapse', width: '100%' }} border={1}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                width: '50%',
                                                                                verticalAlign: 'top'
                                                                            }}>
                                                                                1 Your first name and middle initial
                                                                            <input
                                                                                    disabled={true}
                                                                                    type="text"
                                                                                    style={{ width: '100%', border: 0 }}
                                                                                    id="firstName"
                                                                                    value={this.state.firstName}
                                                                                    onChange={(e) => {
                                                                                        this.setState({ firstName: e.target.value })
                                                                                    }}
                                                                                />

                                                                            </td>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                width: '25%',
                                                                                verticalAlign: 'top'
                                                                            }}>
                                                                                Last name
                                                                            <input
                                                                                    disabled={true}
                                                                                    type="text"
                                                                                    style={{ width: '100%', border: 0 }}
                                                                                    id="lastName"
                                                                                    value={this.state.lastName}
                                                                                    onChange={(e) => {
                                                                                        this.setState({ lastName: e.target.value })
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                width: '25%',
                                                                                verticalAlign: 'top'
                                                                            }}>
                                                                                <span style={{ fontWeight: '900' }}>2 Your social security Number</span>
                                                                                <input
                                                                                    disabled={true}
                                                                                    type="text" style={{ width: '100%', border: 0 }}
                                                                                    id="socialSecurityNumber"
                                                                                    value={this.state.socialSecurityNumber}
                                                                                    onChange={(e) => {
                                                                                        this.setState({ socialSecurityNumber: e.target.value })
                                                                                    }}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr style={{ height: '34px' }}>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                verticalAlign: 'top',
                                                                                width: '50%',
                                                                                borderTop: '0px #ffffff',
                                                                                height: '34px'
                                                                            }}
                                                                                colSpan="1">
                                                                                <div data-font-name="g_d8_f3" data-angle={0}
                                                                                    data-canvas-width="218.47000000000006">Home address (number and street or rural route)
                                                                                <input
                                                                                        disabled={true}
                                                                                        type="text"
                                                                                        style={{ width: '100%', border: 0 }}
                                                                                        id="address"
                                                                                        value={this.state.address}
                                                                                        onChange={(e) => {
                                                                                            this.setState({
                                                                                                address: e.target.value
                                                                                            })
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                width: '50%',
                                                                                borderTop: '0px #ffffff',
                                                                                height: '34px',
                                                                                fontFamily: 'Times New Roman',
                                                                                verticalAlign: 'top'
                                                                            }}
                                                                                colSpan="2">
                                                                                <div data-font-name="g_d8_f2" data-angle={0}
                                                                                    data-canvas-width="408.9536499999999">
                                                                                    3. <input
                                                                                        type="radio"
                                                                                        name="estadoCivil"
                                                                                        id="estadoCivilSingle"
                                                                                        value={this.state.estadoCivil}
                                                                                        style={{ paddingTop: "5px" }}
                                                                                        defaultChecked={this.state.estadoCivil}
                                                                                        onChange={() => {
                                                                                            this.setState({
                                                                                                estadoCivil: true,
                                                                                                estadoCivil1: false,
                                                                                                estadoCivil2: false,
                                                                                            })
                                                                                        }}

                                                                                        style={{ display: "none" }}
                                                                                    />
                                                                                    <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="estadoCivilSingle"
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: `${this.state.estadoCivil ? '&#10003;' : '&#9633;'}`
                                                                                        }}
                                                                                    />
                                                                                    Single&nbsp;&nbsp;
    
                                                                                <input
                                                                                        type="radio"
                                                                                        name="estadoCivil"
                                                                                        id="estadoCivil"
                                                                                        value={this.state.estadoCivil1}
                                                                                        defaultChecked={this.state.estadoCivil1}
                                                                                        style={{ paddingTop: "5px" }}
                                                                                        onChange={() => {
                                                                                            this.setState({
                                                                                                estadoCivil1: true,
                                                                                                estadoCivil: false,
                                                                                                estadoCivil2: false,
                                                                                            })
                                                                                        }}

                                                                                        style={{ display: 'none' }}
                                                                                    />
                                                                                    <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="estadoCivil"
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: `${this.state.estadoCivil1 ? '&#10003;' : '&#9633;'}`
                                                                                        }}
                                                                                    />
                                                                                    Married&nbsp;&nbsp;
                                                                                <input type="checkbox"
                                                                                        onChange={() => {
                                                                                            this.setState({
                                                                                                estadoCivil2: true,
                                                                                                estadoCivil: false,
                                                                                                estadoCivil1: false,
                                                                                            })
                                                                                        }}
                                                                                        defaultChecked={this.state.estadoCivil2}
                                                                                        id="estadoCivil2"
                                                                                        style={{ display: "none" }}
                                                                                    />
                                                                                    <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="estadoCivil2"
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: `${this.state.estadoCivil2 ? '&#10003;' : '&#9633;'}`
                                                                                        }}
                                                                                    />
                                                                                    Married, but withhold at higher Single rate&nbsp;&nbsp;
                                                                                <span style={{ fontWeight: '900' }}>Note:</span> If married filing separately, check “Married, but withhold at higher Single rate.”
    
                                                                                {/* <span style={{paddingRight: "5px", paddingLeft: "5px", paddingTop: "5px", textIndent: "5px"}}>Married</span>
                                                                                <input style={{paddingTop: "5px",textIndent: "8px"}} type="checkbox" /> Married, but withhold at higher Single rate  
                                                                                <span style={{paddingTop: "5px",fontWeight: '900'}}>Note:</span> If married filing separately, check “Married, but withhold at higher Single rate.” */}

                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        <tr style={{ height: '34px' }}>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                verticalAlign: 'top',
                                                                                width: '50%',
                                                                                borderTop: '0px #ffffff',
                                                                                height: '34px'
                                                                            }}
                                                                                colSpan="1">
                                                                                <div data-font-name="g_d8_f3" data-angle={0}
                                                                                    data-canvas-width="218.47000000000006">City or town, state, and ZIP code
                                                                                <input
                                                                                        disabled={true}
                                                                                        type="text"
                                                                                        style={{ width: '100%', border: 0 }}
                                                                                        id="postalCode"
                                                                                        value={this.state.postalCode}
                                                                                        onChange={(e) => {
                                                                                            this.setState({
                                                                                                postalCode: e.target.value
                                                                                            })
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                width: '50%',
                                                                                borderTop: '0px #ffffff',
                                                                                height: '34px',
                                                                                fontFamily: 'Times New Roman',
                                                                                verticalAlign: 'top'
                                                                            }}
                                                                                colSpan="2">
                                                                                <div data-font-name="g_d8_f2" data-angle={0}
                                                                                    data-canvas-width="408.9536499999999"><strong>4  If your last name differs from that shown on your social security card, check here. You must call 800-772-1213 for a replacement card. ▶
                                                                                <input
                                                                                            //disabled={this.state.isCreated}
                                                                                            type="checkbox"
                                                                                            id="socialSecurityExtention"
                                                                                            value={this.state.socialSecurityExtention}
                                                                                            checked={this.state.socialSecurityExtention}
                                                                                            onClick={(e) => {
                                                                                                this.setState({ socialSecurityExtention: e.target.checked })
                                                                                            }}
                                                                                            style={{ display: "none" }}
                                                                                        />

                                                                                        <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="socialSecurityExtention"
                                                                                            dangerouslySetInnerHTML={{
                                                                                                __html: `${this.state.socialSecurityExtention ? '&#10003;' : '&#9633;'}`
                                                                                            }}
                                                                                        />
                                                                                    </strong></div>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table style={{ borderCollapse: 'collapse', width: '100%', borderTop: 0 }}
                                                                    border={1}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                verticalAlign: 'top',
                                                                                width: '100%'
                                                                            }}>
                                                                                <div>
                                                                                    5  Total number of allowances you’re claiming (from the applicable worksheet on the following pages)
                                                                                    6  Additional amount, if any, you want withheld from each paycheck
                                                                                    7  I claim exemption from withholding for 2019, and I certify that I meet both of the following conditions for exemption.
                                                                                    &emsp;• Last year I had a right to a refund of all federal income tax withheld because I had no tax liability, and
                                                                                    &emsp;• This year I expect a refund of all federal income tax withheld because I expect to have no tax liability.
                                                                                    If you meet both conditions, write “Exempt” here
                                                                            </div>
                                                                            </td>
                                                                            <td style={{ lineHeight: "1.5", verticalAlign: 'top', borderCollapse: 'collapse' }}>
                                                                                <table style={{ borderCollapse: 'collapse' }}>
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td style={{
                                                                                                lineHeight: "1.5",
                                                                                                verticalAlign: 'top',
                                                                                                borderCollapse: 'collapse',
                                                                                                borderBottom: 'solid 1px #000'
                                                                                            }}>
                                                                                                5
                                                                                    </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style={{
                                                                                                lineHeight: "1.5",
                                                                                                verticalAlign: 'top',
                                                                                                borderCollapse: 'collapse',
                                                                                                borderBottom: 'solid 1px #000'
                                                                                            }}>6
                                                                                    </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style={{
                                                                                                lineHeight: "1.5",
                                                                                                verticalAlign: 'top',
                                                                                                height: '68px',
                                                                                                background: '#CCC',
                                                                                                borderCollapse: 'collapse',
                                                                                                borderBottom: 'solid 1px #000'
                                                                                            }} />
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style={{
                                                                                                lineHeight: "1.5",
                                                                                                verticalAlign: 'top',
                                                                                                borderCollapse: 'collapse'
                                                                                            }}>7
                                                                                    </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                            <td style={{ lineHeight: "1.5", verticalAlign: 'top', borderCollapse: 'collapse' }}>
                                                                                <table>
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td style={{
                                                                                                lineHeight: "1.5",
                                                                                                verticalAlign: 'top',
                                                                                                borderCollapse: 'collapse',
                                                                                                borderBottom: 'solid 1px #000'
                                                                                            }}>
                                                                                                <input
                                                                                                    //disabled={this.state.isCreated}
                                                                                                    type="text"
                                                                                                    style={{ border: 0, height: '16.5px' }}
                                                                                                    id="excention"
                                                                                                    value={this.state.excention}
                                                                                                    onChange={(e) => {
                                                                                                        this.setState({ excention: e.target.value })
                                                                                                    }}
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style={{
                                                                                                lineHeight: "1.5",
                                                                                                verticalAlign: 'top',
                                                                                                borderCollapse: 'collapse',
                                                                                                borderBottom: 'solid 1px #000'
                                                                                            }}>
                                                                                                <input
                                                                                                    //disabled={this.state.isCreated}
                                                                                                    type="text"
                                                                                                    style={{ border: 0, height: '16.5px' }}
                                                                                                    id="payCheck"
                                                                                                    value={this.state.payCheck}
                                                                                                    onChange={(e) => {
                                                                                                        this.setState({ payCheck: e.target.value })
                                                                                                    }}
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style={{
                                                                                                lineHeight: "1.5",
                                                                                                verticalAlign: 'top',
                                                                                                height: '66px',
                                                                                                background: '#CCC',
                                                                                                borderCollapse: 'collapse',
                                                                                                borderBottom: 'solid 1px #000'
                                                                                            }} />
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style={{ lineHeight: "1.5", verticalAlign: 'top' }}>
                                                                                                <input
                                                                                                    //disabled={this.state.isCreated}
                                                                                                    type="text"
                                                                                                    style={{ border: 0, height: '16.5px' }}
                                                                                                    id="excention-year"
                                                                                                    value={this.state.excentionYear}
                                                                                                    onChange={(e) => {
                                                                                                        this.setState({ excentionYear: e.target.value })
                                                                                                    }}
                                                                                                />
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan="3">
                                                                                Under penalties of perjury, I declare that I have examined this certificate and, to the best of my knowledge and belief, it is true, correct, and complete.
                                                                            <span style={{ fontWeight: '900' }}>Employee’s signature</span>
                                                                                (This form is not valid unless you sign it).  ▶  <img src={this.state.signature}
                                                                                    style={{
                                                                                        width: '100px',
                                                                                        height: '30px',
                                                                                        display: 'inline-block',
                                                                                        backgroundColor: '#f9f9f9',
                                                                                        // cursor: 'pointer'
                                                                                    }} onClick={() => {
                                                                                        // if(this.state.isCreated === false){
                                                                                        //     this.setState({
                                                                                        //         openSignature: true,
                                                                                        //     })
                                                                                        // }
                                                                                    }}
                                                                                    alt="" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date  ▶ {new Date().toDateString()}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>

                                                                <table style={{ borderCollapse: 'collapse', width: '100%' }} border={1}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                width: '65%',
                                                                                verticalAlign: 'top'
                                                                            }}>
                                                                                8 Employer’s name and address (Employer: Complete boxes 8 and 10 if sending to IRS and complete boxes 8, 9, and 10 if sending to State Directory of New Hires.)
                                                                                {/* <FeatureTag code="3807ee0a-d05b-4f51-8f13-6c896f84cc31">
                                                                                                                                                                                                                                                                                                         
                                                                                </FeatureTag> */}
                                                                                {this.state.showReadOnlyFields ? (
                                                                                    <label 
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: `${this.state.employeer}`
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <input
                                                                                    type="text" style={{ width: '100%', border: 0 }}
                                                                                    id="employeer"
                                                                                    value={this.state.employeer}
                                                                                    onChange={(e) => {
                                                                                        this.setState({ employeer: e.target.value })
                                                                                    }}
                                                                                />
                                                                                )}
                                                                            </td>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                width: '15%',
                                                                                verticalAlign: 'top'
                                                                            }}>
                                                                                9 First date of employment
                                                                            {this.state.showReadOnlyFields ? (
                                                                                    <label 
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: `${this.state.firstEmployeeDate}`
                                                                                        }}
                                                                                    />
                                                                            ) : (
                                                                                <input
                                                                                    //disabled={this.state.isCreated}
                                                                                    type="text"
                                                                                    style={{ width: '100%', border: 0, height: '65px' }}
                                                                                    id="firstEmployeeDate"
                                                                                    value={this.state.firstEmployeeDate}
                                                                                    onChange={(e) => {
                                                                                        this.setState({ firstEmployeeDate: e.target.value })
                                                                                    }}
                                                                                />
                                                                            )}                                                                            
                                                                            </td>
                                                                            <td style={{
                                                                                lineHeight: "1.5",
                                                                                fontSize: '11px',
                                                                                fontFamily: 'Times New Roman',
                                                                                width: '20%',
                                                                                verticalAlign: 'top'
                                                                            }}>
                                                                                Employer identification number (EIN)
                                                                                {this.state.showReadOnlyFields ? (
                                                                                    <label 
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: `${this.state.idNumber}`
                                                                                        }}
                                                                                    />
                                                                            ) : (
                                                                                <input
                                                                                    //disabled={this.state.isCreated}
                                                                                    type="text"
                                                                                    style={{ width: '100%', border: 0, height: '65px' }}
                                                                                    id="idNumber"
                                                                                    value={this.state.idNumber}
                                                                                    onChange={(e) => {
                                                                                        this.setState({ idNumber: e.target.value })
                                                                                    }}
                                                                                />
                                                                            )}                                                                            
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <p>&nbsp;</p>
                                                                <table style={{
                                                                    borderCollapse: 'collapse',
                                                                    border: '0px #FFF',
                                                                    width: '100%',
                                                                    fontFamily: 'Times New Roman',
                                                                    fontSize: '11px'
                                                                }} >
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style={{ lineHeight: "1.5", width: '33.3333%', verticalAlign: 'top', padding: '8px 24px', paddingLeft: '0px' }}>
                                                                                <p>income includes all of your wages and other income, including income earned by a spouse if you are filing a join return.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Line G. Other credits.</span> You may be able to reduce the tax withheld from your paycheck if you expect to claim other tax credits, such as tax credits for education (see Pub. 970). If you do so, your paycheck will be larger, but the amount of any refund that you receive when you file your tax return will be smaller. Follow the instructions for Worksheet 1-6 in Pub. 505 if you want to reduce your withholding to take these credits into account. Enter “-0-” on lines E and F if you use Worksheet 1-6.</p>
                                                                                <p><h5>Deductions, Adjustments, and Additional Income Worksheet</h5> Complete this worksheet to determine if you’re able to reduce the tax withheld from your paycheck to account for your itemized deductions and other adjustments to income, such as IRA contributions. If you do so, your refund at the end of the year will be smaller, but your paycheck will be larger. You’re not required to complete this worksheet or reduce your withholding if you don’t wish to do so.</p>
                                                                                <p>You can also use this worksheet to figure out how much to increase the tax withheld from your paycheck if you have a large amount of nonwage income not subject to withholding, such as interest or dividends.</p>
                                                                                <p>Another option is to take these items into account and make your withholding more accurate by using the calculator at www.irs.gov/W4App. If you use the calculator, you don’t need to complete any of the worksheets for Form W-4.</p>
                                                                                <p><h5>Two-Earners/Multiple Jobs Worksheet</h5> Complete this worksheet if you have more than one job at a time or are married filing jointly and have a working spouse. If you</p>
                                                                            </td>
                                                                            <td style={{ lineHeight: "1.5", width: '33.3333%', verticalAlign: 'top', padding: '8px 24px' }}>
                                                                                <p>don't complete this worksheet, you might have too little tax withheld. If so, you will owe tax when you file your tax return and might be subject to a penalty.</p>
                                                                                <p>Figure the total number of allowances you’re entitled to claim and any additional amount of tax to withhold on all jobs using worksheets from only one Form W-4. Claim all allowances on the W-4 that you or your spouse file for the highest paying job in your family and claim zero allowances on Forms W-4 filed for all other jobs. For example, if you earn $60,000 per year and your spouse earns $20,000, you should complete the worksheets to determine what to enter on lines 5 and 6 of your Form W-4, and your spouse should enter zero (“-0-”) on lines 5 and 6 of his or her Form W-4. See Pub. 505 for details.</p>
                                                                                <p>Another option is to use the calculator at www.irs.gov/W4App to make your withholding more accurate.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Tip:</span> If you have a working spouse and your incomes are similar, you can check the “Married, but withhold at higher Single rate” box instead of using this worksheet. If you choose this option, then each spouse should fill out the Personal Allowances Worksheet and check the “Married, but withhold at higher Single rate” box on Form W-4, but only one spouse should claim any allowances for credits or fill out the Deductions, Adjustments, and Additional Income Worksheet.</p>
                                                                                <p><h5>Instructions for Employer</h5> <span style={{ fontWeight: '900' }}> Employees, do not complete box 8, 9, or 10. Your employer will complete these boxes if necessary.</span></p>
                                                                                <p><span style={{ fontWeight: '900' }}>New hire reporting.</span> Employers are required by law to report new employees to a designated State Directory of New Hires. Employers may use Form W-4, boxes 8, 9,</p>
                                                                            </td>
                                                                            <td style={{ lineHeight: "1.5", width: '33.3333%', verticalAlign: 'top', padding: '8px 24px', paddingRight: '0px' }}>
                                                                                <p>and 10 to comply with the new hire reporting requirement for a newly hired employee. A newly hired employee is an employee who hasn’t previously been employed by the employer, or who was previously employed by the employer but has been separated from such prior employment for at least 60 consecutive days. Employers should contact the appropriate State Directory of New Hires to find out how to submit a copy of the completed Form W-4. For information and links to each designated State Directory of New Hires (including for U.S. territories), go to <span style={{ fontWeight: '900' }}>www.acf.hhs.gov/css/employers.</span></p>
                                                                                <p>If an employer is sending a copy of Form W-4 to a designated State Directory of New Hires to comply with the new hire reporting requirement for a newly hired employee, complete boxes 8, 9, and 10 as follows.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Box 8.</span> Enter the employer’s name and address. If the employer is sending a copy of this form to a State Directory of New Hires, enter the address where child support agencies should send income withholding orders.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Box 9.</span> If the employer is sending a copy of this form to a State Directory of New Hires, enter the employee’s first date of employment, which is the date services for payment were first performed by the employee. If the employer rehired the employee after the employee had been separated from the employer’s service for at least 60 days, enter the rehire date.</p>
                                                                                <p><span style={{ fontWeight: '900' }}>Box 10.</span> Enter the employer’s employer identification number (EIN).</p>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

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
}

export default withApollo(withGlobalContent(FormsW4));



