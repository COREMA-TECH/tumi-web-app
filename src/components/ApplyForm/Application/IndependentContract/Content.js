import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import PropTypes from 'prop-types';

class IndependentContractContent extends Component {

    constructor(props) {

        super(props);

        this.state = {
            signature: '',
            signType: null,
            openSignature: false,
            ApplicationId: this.props.applicationId,
            isCreated: null,
            initialFirst: '',
            initialSecond: '',
            initialThird: '',
            initialFourth: ''
        }
    }


    handleOpenSign = () => {
        this.setState(() => ({ openSignature: true }));
    }

    renderSignatureDialog = () => (
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
                    <SignatureForm signatureValue={this.handleSignature} showSaveIcon={null} />
                </DialogContent>
            </Dialog>
        </div>
    );

    handleSignature = (value) => {
        this.setState(() => ({
            signature: value,
            openSignature: false
        }), () => {
            this.props.setSignStatus((this.state.signature || '').length > 0)
        });
    }

    handleOnChange = (e) => {
        let element = e.target;
        this.setState(() => ({ [element.id]: element.value }));
    }

    render() {
        return <React.Fragment>
            {this.renderSignatureDialog()}
            <div id='independenContractContainer'>
                <p></p>
                <p ><span >RECONOCIMIENTO DE CONTRATO INDEPENDIENTE</span></p>
                <p ><span style={{ fontSize: 13 }} >Comprendo que Tumi Staffing me ofrece un empleo condicional como contratista independiente en espera de que complete la documentaci&oacute;n requerida para la nueva contrataci&oacute;n. Hasta que se complete mi documentaci&oacute;n y cumpla con toda la documentaci&oacute;n bajo las leyes estatales y federales, mi estado como contratista independiente es d&iacute;a a d&iacute;a hasta que cumpla los requisitos.</span></p>
                <p ><span style={{ fontSize: 13, textTransform: 'uppercase' }}>INICIAL<input id='initialFirst' maxLength="2" type='text' style={{ fontSize: 13, textTransform: 'uppercase' }} className='ml-1 border-bottom' onChange={this.handleOnChange} value={this.state.initialFirst} required /></span></p>
                <p >&nbsp;</p>
                <p ><span style={{ fontSize: 13 }}>Entiendo que, como contratista independiente, no estar&eacute; cubierto por el seguro de compensaci&oacute;n para trabajadores, y que soy el &uacute;nico responsable de cualquier gasto medico que resulte de una lesi&oacute;n o accidente en mi empleo condicional.</span></p>
                <p ><span >INICIAL <input id='initialSecond' maxLength="2" type='text' style={{ fontSize: 13, textTransform: 'uppercase' }} className='ml-1 border-bottom' onChange={this.handleOnChange} value={this.state.initialSecond} required /></span></p>
                <p >&nbsp;</p>
                <p ><span style={{ fontSize: 13 }}>Como contratista independiente, no ser&eacute; elegible para el plan de Beneficios de Personal de Tumi Staffing hasta que cumpla con los requisitos. No ser&eacute; elegible para ning&uacute;n pago acumulado de vacaciones hasta el momento en que cumpla con los requisitos. Entiendo que los beneficios de vacaciones lo recibir&eacute; al ano de haber cumplido con los requisitos. No estar&eacute; sujeto a ning&uacute;n aumento salarial hasta que cumpla con los requisitos.</span></p>
                <p ><span >INICIAL <input id='initialThird' maxLength="2" type='text' style={{ fontSize: 13, textTransform: 'uppercase' }} className='ml-1 border-bottom' onChange={this.handleOnChange} value={this.state.initialThird} required /></span></p>
                <p >&nbsp;</p>
                <p ><span style={{ fontSize: 13 }}>Me comprometo a proporcionar toda la documentaci&oacute;n necesaria para cumplir lo antes posible con mi contrataci&oacute;n y trabajare para proporcionar cualquiera o todos los elementos faltantes necesarios para mi nuevo registro de contrataci&oacute;n.</span></p>
                <p ><span >INICIAL <input id='initialFourth' maxlength="2" type='text' style={{ fontSize: 13, textTransform: 'uppercase' }} className='ml-1 border-bottom' onChange={this.handleOnChange} value={this.state.initialFourth} required /></span></p>
                <p >&nbsp;</p>
                <table>
                    <tr>
                        <td valign='bottom'>
                            <img style={{
                                width: '175px',
                                height: '55px',
                                display: 'inline-block',
                                backgroundColor: '#f9f9f9',
                                cursor: 'pointer'
                            }}
                                onClick={this.handleOpenSign}
                                alt='' src={this.state.signature} />
                            <p ><span >_________________________ </span></p>
                            <p ><span >FIRMA </span></p>
                        </td>
                        <td valign='bottom'>
                            <p > <span className='border-bottom'>{new Date().toISOString().substring(0, 10)}</span></p>
                            <p > <span >FECHA</span></p>

                        </td >
                    </tr >
                </table >

                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </div>
        </React.Fragment >
    }
}

IndependentContractContent.propTypes = {
    applicationId: PropTypes.object.isRequired,
    setSignStatus: PropTypes.func.isRequired
};

export default IndependentContractContent;