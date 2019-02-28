import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import { CREATE_DOCUMENTS_PDF_QUERY, GET_ANTI_HARRASMENT_INFO, GET_APPLICANT_INFO } from "./Queries";
import { ADD_W4 } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';
const uuidv4 = require('uuid/v4');

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
        }
    }


    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: new Date().toISOString().substring(0, 10)
        }, () => {
           //this.insertAntiHarrasment(this.state);
        });
    };

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
                    this.setState({
                        isCreated: true,
                        html: data.applicantW4[0].html != null ? data.applicantW4[0].html : ''
                    }, () => {
                        console.log("HTML: ", this.state.html);

                        if(this.state.html.length > 0){
                            let pdf = document.getElementById('pdf-ready').innerHTML = this.state.html;
                        }
                    });
                } else {
                    this.setState({
                        isCreated: false,
                    })
                }
            })
            .catch(error => {

            })
    };

    // insertW4 = (item) => {
    //     let harassmentObject = Object.assign({}, item);
    //     delete harassmentObject.openSignature;
    //     delete harassmentObject.id;
    //     delete harassmentObject.accept;
    //
    //
    //     this.props.client
    //         .mutate({
    //             mutation: ADD_ANTI_HARASSMENT,
    //             variables: {
    //                 harassmentPolicy: harassmentObject
    //             }
    //         })
    //         .then(({ data }) => {
    //             console.log("entro al data ", data);
    //             this.props.handleOpenSnackbar(
    //                 'success',
    //                 'Successfully signed!',
    //                 'bottom',
    //                 'right'
    //             );
    //
    //             this.setState({
    //                 id: data.addHarassmentPolicy[0].id
    //             })
    //         })
    //         .catch(error => {
    //             // If there's an error show a snackbar with a error message
    //             this.props.handleOpenSnackbar(
    //                 'error',
    //                 'Error to sign Anti Harrasment information. Please, try again!',
    //                 'bottom',
    //                 'right'
    //             );
    //         });
    // };

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
                    contentHTML: document.getElementById('DocumentPDF').outerHTML,
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


    downloadDocumentsHandler = (random) => {
        var url = this.context.baseUrl + '/public/Documents/' + "W4-" + random + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };


    componentWillMount() {
        //this.getHarrasmentInformation(this.props.applicationId);
        this.getApplicantInformation(this.props.applicationId);
    }

    validateW4 = () => {
        let firstName = document.getElementById('firstName');
        let lastName = document.getElementById('lastName');
        let socialSecurityNumber = document.getElementById('socialSecurityNumber');
        let idNumber = document.getElementById('idNumber');
        let firstEmployeeDate = document.getElementById('firstEmployeeDate');
        let employeer = document.getElementById('employeer');
        let excention = document.getElementById('excention');
        let payCheck = document.getElementById('payCheck');
        let excentionYear = document.getElementById('excention-year');
        let address = document.getElementById('address');
        let postalCode = document.getElementById('postalCode');
        let socialSecurityExtention = document.getElementById('socialSecurityExtention');


        if(this.state.signature.length === 0) {
            this.props.handleOpenSnackbar(
                'warning',
                'You must sign the document!',
                'bottom',
                'right'
            );
        } else if (firstName.value.length > 0 &&
            lastName.value.length > 0 &&
            socialSecurityNumber.value.length > 0) {

            firstName.disabled = true;
            lastName.disabled = true;
            socialSecurityNumber.disabled = true;
            idNumber.disabled = true;
            firstEmployeeDate.disabled = true;
            employeer.disabled = true;
            excention.disabled = true;
            payCheck.disabled = true;
            excentionYear.disabled = true;
            address.disabled = true;
            postalCode.disabled = true;
            socialSecurityExtention.disabled = true;

            let html = document.getElementById('w4Html');

            this.props.client
                .mutate({
                    mutation: ADD_W4,
                    variables: {
                        html: html.outerHTML,
                        ApplicantId: this.props.applicationId
                    }
                })
                .then(({ data }) => {
                    this.props.handleOpenSnackbar(
                        'success',
                        'Created successfully',
                        'bottom',
                        'right'
                    );
                    this.getApplicantInformation(this.props.applicationId)
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
        return new Promise((resolve) => setTimeout(resolve, 5000));
    }


    render() {
        let renderSignatureDialog = () => (
            <div>
                <Dialog
                    open={this.state.openSignature}
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
                    <DialogTitle>
                        <h1 className="primary apply-form-container__label text-center">Please Sign</h1>
                    </DialogTitle>
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

        // if(this.state.isCreated){
        //     let inputs = document.getElementsByTagName('input');
        //     for (let index = 0; index < inputs.length; ++index) {
        //         // deal with inputs[index] element.
        //         inputs[index].disabled = true;
        //     }
        // }

        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[9].label}</span>
                                {
                                    this.state.isCreated === null ? (
                                        ''
                                    ) : (
                                            this.state.isCreated ? (
                                                <button className="applicant-card__edit-button" onClick={() => {
                                                    let random = uuidv4();

                                                    this.createDocumentsPDF(random);
                                                    this.sleep().then(() => {
                                                        this.downloadDocumentsHandler(random);
                                                    }).catch(error => {
                                                        this.setState({ downloading: false })
                                                    })
                                                }}>{this.state.downloading && (
                                                    <React.Fragment>Downloading <i
                                                        class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                                    {!this.state.downloading && (
                                                        <React.Fragment>{actions[9].label} <i
                                                            className="fas fa-download" /></React.Fragment>)}

                                                </button>
                                            ) : (
                                                    <button className="applicant-card__edit-button" onClick={() => {
                                                        this.validateW4();
                                                    }}>{actions[4].label} <i className="far fa-save" />
                                                    </button>
                                                )
                                        )
                                }
                            </div>
                            {
                                this.state.html.length > 0 ? (
                                    <div id="pdf-ready" style={{ width: '800px', margin: '0 auto' }}>
                                    </div>
                                ) : (
                                        <div style={{ width: '800px', margin: '0 auto' }}>
                                            <div className="row pdf-container--i9-w4" id="w4Html">
                                                <div id="DocumentPDF" className="signature-information">
                                                    <div>
                                                        <table style={{
                                                            fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                            fontSize: '14px',
                                                            border: '0px #FFF',
                                                            borderCollapse: 'collapse',
                                                            width: '100%'
                                                        }} border={1}>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: '50%', verticalAlign: 'top' }}>
                                                                        <h1 style={{ textDecoration: 'underline' }}><strong>Form W-4
                                                                    (2019) </strong></h1>
                                                                        <p>Acontecimientos futuros. Toda información sobre
                                                                            acontecimientos
                                                                            futuros que afecten al
                                                                            Formulario W-4(SP) (como legislación aprobada después de
                                                                            que el
                                                                            formulario ha sido
                                                                    publicado) será anunciada en <a
                                                                                href="www.irs.gov/FormW4SP.Prop">www.irs.gov/FormW4SP.</a>
                                                                        </p>
                                                                        <p>Propósito. Complete el Formulario W-4(SP) para que su
                                                                            empleador
                                                                            pueda retener la cantidad
                                                                            correcta del impuesto federal sobre los ingresos de su
                                                                            paga.
                                                                            Considere completar un nuevo
                                                                            Formulario
                                                                            W-4(SP) cada año y cuando su situación personal o
                                                                            financiera
                                                                    cambie.</p>
                                                                        <p>Exención de la retención. Puede reclamar la exención de
                                                                            la
                                                                            retención
                                                                            para
                                                                            2019 si ambas de las siguientes situaciones le
                                                                    corresponde:</p>
                                                                        <ul>
                                                                            <li>Para 2018 tenía derecho a un reembolso de todo el
                                                                                impuesto
                                                                                federal sobre los ingresos
                                                                                retenido porque notenía obligación tributaria y
                                                                    </li>
                                                                            <li>Para 2019 espera un reembolso de todo el impuesto
                                                                                federal
                                                                                sobre ingreso retenido porque
                                                                                usted
                                                                                espera notener obligación tributaria.
                                                                    </li>
                                                                            <li>Si está exento, complete sólo las líneas 1,2,3,4 y 7
                                                                                y firme
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
                                                                    </li>
                                                                        </ul>
                                                                        <p>Instrucciones Generales</p>
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
                                                                        <p>También puede usar la calculadora en <a
                                                                            href="www.irs.gov/W4AppSP">www.irs.gov/W4AppSP</a>
                                                                            para determinar su retención de impuestos con mayor
                                                                            precisión.
                                                                            Considere usar esta
                                                                    calculadora si</p>
                                                                    </td>
                                                                    <td style={{ width: '49.9468%', verticalAlign: 'top' }}>
                                                                        <p style={{ textAlign: 'left' }}>tiene una situación
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
                                                                        <p style={{ textAlign: 'left' }}>Tenga en cuenta que si
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
                                                                        <p style={{ textAlign: 'left' }}>Personas con múltiples
                                                                            trabajos o con
                                                                            cónyuges que
                                                                            trabajan.
                                                                            Si tiene más de un trabajo a la vez, o si es casado que
                                                                            presenta
                                                                            una declaración
                                                                            conjunta y su cónyuge trabaja, lea todas las
                                                                            instrucciones,
                                                                            incluyendo las instrucciones
                                                                            para
                                                                            la Hoja de Trabajo para Dos Asalariados o Múltiples
                                                                            Empleos
                                                                    antes de comenzar.</p>
                                                                        <p style={{ textAlign: 'left' }}>Ingresos no derivados del
                                                                            trabajo. Si
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
                                                                            impuestos adicionales. O bien, puede usar la Hoja de
                                                                            Trabajo
                                                                            para Deducciones, Ajustes e Ingreso
                                                                    Adicional en la página 4 o la calculadora en <a
                                                                                href="www.irs.gov/W4AppSP">www.irs.gov/W4AppSP</a> para
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
                                                                        <p style={{ textAlign: 'left' }}>Extranjero no residente. Si
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
                                                        <p><img src="https://i.imgur.com/wJ2ancW.png"
                                                            style={{ width: '100% !important' }} />
                                                        </p>
                                                        <table style={{ borderCollapse: 'collapse', width: '100%' }} border={1}>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        width: '33.3333%',
                                                                        verticalAlign: 'top'
                                                                    }}>
                                                                        1 Su primer nombre e inicial del segundo
                                                                <input
                                                                            disabled={this.state.isCreated}
                                                                            type="text"
                                                                            style={{ width: '100%', border: 0 }}
                                                                            id="firstName"
                                                                            value={this.state.firstName}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                this.setState({ firstName: e.target.value })
                                                                            }}
                                                                        />

                                                                    </td>
                                                                    <td style={{
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        width: '33.3333%',
                                                                        verticalAlign: 'top'
                                                                    }}>
                                                                        Apellido
                                                                <input
                                                                            disabled={this.state.isCreated}
                                                                            type="text"
                                                                            style={{ width: '100%', border: 0 }}
                                                                            id="lastName"
                                                                            value={this.state.lastName}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                this.setState({ lastName: e.target.value })
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td style={{
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        width: '33.3333%',
                                                                        verticalAlign: 'top'
                                                                    }}>
                                                                        2 Su número de Seguro Social
                                                                <input
                                                                            disabled={this.state.isCreated}
                                                                            type="text" style={{ width: '100%', border: 0 }}
                                                                            id="socialSecurityNumber"
                                                                            value={this.state.socialSecurityNumber}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                this.setState({ socialSecurityNumber: e.target.value })
                                                                            }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ height: '34px' }}>
                                                                    <td style={{
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        verticalAlign: 'top',
                                                                        width: '50%',
                                                                        borderTop: '0px #ffffff',
                                                                        height: '34px'
                                                                    }}
                                                                        colSpan="1">
                                                                        <div data-font-name="g_d8_f3" data-angle={0}
                                                                            data-canvas-width="218.47000000000006">Dirección (número de casa y calle o ruta rural)
                                                                    <input
                                                                                disabled={this.state.isCreated}
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
                                                                        fontSize: '11px',
                                                                        width: '50%',
                                                                        borderTop: '0px #ffffff',
                                                                        height: '34px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
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
                                                                            /> Casado, pero retiene con la tasa mayor de Solter
                                                                            <strong> Nota: </strong> <br />
                                                                            Si es casado, pero está legalmente separado, marque el recuadro “Casado, pero retiene con la tasa mayor de Soltero”.
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                <tr style={{ height: '34px' }}>
                                                                    <td style={{
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
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
                                                                                disabled={this.state.isCreated}
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
                                                                        fontSize: '11px',
                                                                        width: '50%',
                                                                        borderTop: '0px #ffffff',
                                                                        height: '34px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        verticalAlign: 'top'
                                                                    }}
                                                                        colSpan="2">
                                                                        <div data-font-name="g_d8_f2" data-angle={0}
                                                                            data-canvas-width="408.9536499999999"><strong>4 Si su
                                                                           apellido es distinto al que aparece en su tarjeta de
                                                                           Seguro
                                                                           Social, marque este recuadro.
                                                                           Debe llamar al 800-772-1213 para recibir una tarjeta de
                                                                           reemplazo. ▶
                                                                    <input
                                                                                    disabled={this.state.isCreated}
                                                                                    type="checkbox"
                                                                                    id="socialSecurityExtention"
                                                                                    value={this.state.socialSecurityExtention}
                                                                                    defaultChecked={this.state.socialSecurityExtention}
                                                                                    onClick={(e) => {
                                                                                        console.log(e.target.checked);
                                                                                        this.setState({ socialSecurityExtention: e.target.checked })
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
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        verticalAlign: 'top',
                                                                        width: '100%'
                                                                    }}>
                                                                        5 Número total de exenciones que reclama (de la hoja de
                                                                        trabajo que
                                                                        le corresponda en las
                                                                siguientes páginas)<br />
                                                                        6 Cantidad adicional, si la hay, que desea que se le retenga
                                                                        de cada
                                                                cheque de paga<br />
                                                                        7 Reclamo exención de la retención para 2019 y certifico que
                                                                        cumplo
                                                                        con ambas condiciones, a continuación, para la
                                                                exención:<br />
                                                                        <ul>
                                                                            <li>
                                                                                El año pasado tuve derecho a un reembolso de todos
                                                                                los
                                                                                impuestos federales sobre el ingreso retenidos
                                                                                porque no
                                                                                tuve obligación tributaria alguna y
                                                                    </li>
                                                                            <li>
                                                                                Este año tengo previsto un reembolso de todos los
                                                                                impuestos
                                                                                federales sobre los ingresos retenidos porque tengo
                                                                                previsto
                                                                                no tener una obligación tributaria
                                                                    </li>
                                                                        </ul>
                                                                        Si cumple con ambas condiciones, escriba “Exempt” (Exento)
                                                                        aquí
                                                            </td>
                                                                    <td style={{ verticalAlign: 'top', borderCollapse: 'collapse' }}>
                                                                        <table style={{ borderCollapse: 'collapse' }}>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style={{
                                                                                        verticalAlign: 'top',
                                                                                        borderCollapse: 'collapse',
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}>
                                                                                        5
                                                                        </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style={{
                                                                                        verticalAlign: 'top',
                                                                                        borderCollapse: 'collapse',
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}>6
                                                                        </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style={{
                                                                                        verticalAlign: 'top',
                                                                                        height: '68px',
                                                                                        background: '#CCC',
                                                                                        borderCollapse: 'collapse',
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }} />
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style={{
                                                                                        verticalAlign: 'top',
                                                                                        borderCollapse: 'collapse'
                                                                                    }}>7
                                                                        </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                    <td style={{ verticalAlign: 'top', borderCollapse: 'collapse' }}>
                                                                        <table>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style={{
                                                                                        verticalAlign: 'top',
                                                                                        borderCollapse: 'collapse',
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}>
                                                                                        <input
                                                                                            disabled={this.state.isCreated}
                                                                                            type="text"
                                                                                            style={{ border: 0, height: '16.5px' }}
                                                                                            id="excention"
                                                                                            value={this.state.excention}
                                                                                            onChange={(e) => {
                                                                                                console.log(e.target.value);
                                                                                                this.setState({ excention: e.target.value })
                                                                                            }}
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style={{
                                                                                        verticalAlign: 'top',
                                                                                        borderCollapse: 'collapse',
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}>
                                                                                        <input
                                                                                            disabled={this.state.isCreated}
                                                                                            type="text"
                                                                                            style={{ border: 0, height: '16.5px' }}
                                                                                            id="payCheck"
                                                                                            value={this.state.payCheck}
                                                                                            onChange={(e) => {
                                                                                                console.log(e.target.value);
                                                                                                this.setState({ payCheck: e.target.value })
                                                                                            }}
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style={{
                                                                                        verticalAlign: 'top',
                                                                                        height: '66px',
                                                                                        background: '#CCC',
                                                                                        borderCollapse: 'collapse',
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }} />
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style={{ verticalAlign: 'top' }}>
                                                                                        <input
                                                                                            disabled={this.state.isCreated}
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
                                                                        Bajo pena de perjurio, declaro haber examinado este certificado y que a mi leal saber y entender, es verídico, correcto y completo.  Firma del empleado
                                                                        (Este formulario no es válido a menos que usted lo firme).  ▶ <img style={{
                                                                            width: '100px',
                                                                            height: '30px',
                                                                            display: 'inline-block',
                                                                            backgroundColor: '#f9f9f9',
                                                                            cursor: 'pointer'
                                                                    }} onClick={() => {
                                                                        if(this.state.isCreated === false){
                                                                            this.setState({
                                                                                openSignature: true,
                                                                            })
                                                                        }
                                                                    }}
                                                                    src={this.state.signature} alt=""/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Fecha  ▶ {new Date().toDateString()}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        {/*<table style={{*/}
                                                            {/*borderCollapse: 'collapse',*/}
                                                            {/*width: '100%',*/}
                                                            {/*height: '51px',*/}
                                                            {/*borderTop: 0*/}
                                                        {/*}} border={1}>*/}
                                                            {/*<tbody>*/}
                                                                {/*<tr style={{ height: '17px' }}>*/}
                                                                    {/*<td style={{*/}
                                                                        {/*fontSize: '11px',*/}
                                                                        {/*fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',*/}
                                                                        {/*verticalAlign: 'top',*/}
                                                                        {/*width: '50%',*/}
                                                                        {/*borderTop: '0px #ffffff',*/}
                                                                        {/*height: '17px'*/}
                                                                    {/*}}>*/}
                                                                        {/*Dirección (número de casa y*/}
                                                                        {/*calle o ruta rural)*/}
                                                                {/*<input*/}
                                                                            {/*disabled={this.state.isCreated}*/}
                                                                            {/*type="text"*/}
                                                                            {/*style={{ width: '100%', border: 0 }}*/}
                                                                            {/*id="address"*/}
                                                                            {/*value={this.state.address}*/}
                                                                            {/*onChange={(e) => {*/}
                                                                                {/*this.setState({*/}
                                                                                    {/*address: e.target.value*/}
                                                                                {/*})*/}
                                                                            {/*}}*/}
                                                                        {/*/>*/}
                                                                    {/*</td>*/}
                                                                    {/*<td style={{*/}
                                                                        {/*fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',*/}
                                                                        {/*verticalAlign: 'top',*/}
                                                                        {/*width: '50%',*/}
                                                                        {/*borderTop: '0px #ffffff',*/}
                                                                        {/*height: '17px'*/}
                                                                    {/*}}>*/}
                                                                        {/*&nbsp;</td>*/}
                                                                {/*</tr>*/}

                                                            {/*</tbody>*/}
                                                        {/*</table>*/}
                                                        <table style={{ borderCollapse: 'collapse', width: '100%' }} border={1}>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        width: '33.3333%',
                                                                        verticalAlign: 'top'
                                                                    }}>
                                                                        8 Nombre y dirección del empleador (Empleador: Complete las
                                                                        líneas 8
                                                                        y 10 si
                                                                        envía este
                                                                        certificado
                                                                        alIRS y complete las líneas 8, 9 y 10 si lo envía al State
                                                                        Directory
                                                                        of New Hires
                                                                        (Directorio
                                                                        estatal de personas recién empleadas).
                                                                <input
                                                                            disabled={this.state.isCreated}
                                                                            type="text" style={{ width: '100%', border: 0 }}
                                                                            id="employeer"
                                                                            value={this.state.employeer}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                this.setState({ employeer: e.target.value })
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td style={{
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        width: '33.3333%',
                                                                        verticalAlign: 'top'
                                                                    }}>
                                                                        9 Primera fecha de empleo
                                                                <input
                                                                            disabled={this.state.isCreated}
                                                                            type="text"
                                                                            style={{ width: '100%', border: 0, height: '65px' }}
                                                                            id="firstEmployeeDate"
                                                                            value={this.state.firstEmployeeDate}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                this.setState({ firstEmployeeDate: e.target.value })
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td style={{
                                                                        fontSize: '11px',
                                                                        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                                        width: '33.3333%',
                                                                        verticalAlign: 'top'
                                                                    }}>
                                                                        10 Número de identificación del empleador(EIN)
                                                                <input
                                                                            disabled={this.state.isCreated}
                                                                            type="text"
                                                                            style={{ width: '100%', border: 0, height: '65px' }}
                                                                            id="idNumber"
                                                                            value={this.state.idNumber}
                                                                            onChange={(e) => {
                                                                                console.log(e.target.value);
                                                                                this.setState({ idNumber: e.target.value })
                                                                            }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <p>&nbsp;</p>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            border: '0px #FFF',
                                                            width: '100%',
                                                            fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                                                            fontSize: '14px'
                                                        }} border={1}>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: '50%', verticalAlign: 'top' }}>
                                                                        <p><strong>Instrucciones Específicas.</strong></p>
                                                                        <p>Hoja de Trabajo para Descuentos Personales Complete esta
                                                                            hoja de
                                                                            trabajo en la página 4
                                                                            primero para determinar el número de descuentos
                                                                            personales de
                                                                            retención que debe
                                                                    reclamar.</p>
                                                                        <p><strong>Línea C. Cabeza de familia, tenga en
                                                                    cuenta:</strong> Por
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
                                                                        <p>Línea E. Crédito tributario por hijos. Cuando presente su
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
                                                                        <p><strong>Línea F. Crédito para otros
                                                                    dependientes.</strong> Cuando
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
                                                                    <td style={{ width: '50%', verticalAlign: 'top' }}>
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
                                                                        <p><strong>Línea G. Otros créditos.</strong> Usted podría
                                                                            reducir el
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
                                                                    en las líneas E y F.</p>
                                                                        <p><strong>Hoja de Trabajo para Deducciones, Ajustes e
                                                                            Ingreso
                                                                    Adicional</strong></p>
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



