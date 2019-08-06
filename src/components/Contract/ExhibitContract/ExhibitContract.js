import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import TextAreaForm from 'ui-components/InputForm/TextAreaForm';
import withApollo from 'react-apollo/withApollo';
import { gql } from 'apollo-boost';
import PositionsCompanyForm from '../../Company/PositionsCompanyForm/';

import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import renderHTML from 'react-render-html';
import { GET_CONTRACT } from './Queries';

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
    inputControl: {},
    departmentControl: {
        width: '200px',
        paddingRight: '0px'
    },
    shiftControl: {
        width: '100px',
        paddingRight: '0px'
    },
    resize: {
        //width: '200px'
    },
    divStyle: {
        width: '95%',
        display: 'flex'
        //justifyContent: 'space-around'
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
    buttonCreateContract: {
        background: '#28a745',
        borderRadius: '5px',
        padding: '.5em 1em',

        fontWeight: '300',
        fontFamily: 'Segoe UI',
        fontSize: '1.1em',
        color: '#fff',
        textTransform: 'none',
        //cursor: pointer;
        margin: '2px',

        //	backgroundColor: '#357a38',
        color: 'white',
        '&:hover': {
            background: '#218838'
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
        //color: ,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
});

class ExhibitContract extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exhibitA: '',
            exhibitB: '',
            exhibitC: '',
            exhibitD: '',
            exhibitE: '',
            exhibitF: '',
            PdfUrl: '',
            agreement: '',
            openModal: false
        };
    }

    ADD_EXHIBIT = gql`
        mutation updcontracstexhibit(
        $Id: Int
        $Exhibit_B: String
        $Exhibit_C: String
        $Exhibit_D: String
        $Exhibit_E: String
        $Exhibit_F: String
        ) {
            updcontracstexhibit(
                Id: $Id
                Exhibit_B: $Exhibit_B
                Exhibit_C: $Exhibit_C
                Exhibit_D: $Exhibit_D
                Exhibit_E: $Exhibit_E
                Exhibit_F: $Exhibit_F
            ) {
                Id
                Exhibit_B
                Exhibit_C
                Exhibit_D
                Exhibit_E
                Exhibit_F
            }
        }
    `;

    GET_AGREEMENT_QUERY = gql`
        query getcontracts($Id: Int) {
            getcontracts(Id: $Id) {
                Contract_Terms
            }
        }
    `;

    SEND_CONTRACT_QUERY = gql`
        query sendcontracts($Id: Int) {
            sendcontracts(Id: $Id, IsActive: 1) {
                Id
                Electronic_Address
                Primary_Email
            }
        }
    `;

    CREATE_CONTRACT_QUERY = gql`
        query createcontracts($Id: Int) {
            createcontracts(Id: $Id, IsActive: 1) {
                Id
                Electronic_Address
                Primary_Email
                Contract_Terms
            }
        }
    `;

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    writePDF = () => {
        //this.sleep().then(() => {
        //	this.setState({ openModal: true }, () => {
        // Do something after the sleep!
        this.setState({
            PdfUrl:
                '<iframe src="' +
                this.context.baseUrl +
                '/public/Contract_' +
                this.props.contractname +
                '.pdf"  width="100%" height="100%" />'
        });
        //	});
        //});
    };

    sendContract = () => {
        this.setState({ loadingData: true });
        this.props.client
            .query({
                query: this.SEND_CONTRACT_QUERY,
                variables: { Id: this.props.contractId },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.sendcontracts != null) {
                    this.props.handleOpenSnackbar('success', 'Contract Sent!');
                    this.resetState();
                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: sendcontracts not exists in query data'
                    );
                    this.setState({ loadingData: false });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
                this.setState({ loadingData: false });
            });
    };

    createContract = () => {
        this.setState({ loadingData: true, loadingContract: true });
        this.props.client
            .query({
                query: GET_CONTRACT,
                variables: { Id: this.props.contractId },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                let url = data.data.contracts[0];
                
                if (url) {
                    this.setState({
                        openModal: true,
                        loadingContract: false,
                        PdfUrl:
                            '<iframe src="' +
                            url.Contract_Terms +
                            '"  width="100%" height="100%" />'
                    });
                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: createcontracts not exists in query data'
                    );
                    this.setState({
                        loadingData: false,
                        loadingContract: false
                    });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
                this.setState({
                    loadingData: false,
                    loadingContract: false
                });
            });

        // this.props.client
        //     .query({
        //         query: this.CREATE_CONTRACT_QUERY,
        //         variables: { Id: this.props.contractId },
        //         fetchPolicy: 'no-cache'
        //     })
        //     .then((data) => {
        //         if (data.data.createcontracts != null) {
        //             this.sleep().then(() => {
        //                 this.setState({
        //                     openModal: true,
        //                     loadingContract: false,
        //                     PdfUrl:
        //                         '<iframe src="' +
        //                         this.context.baseUrl +
        //                         '/public/Contract_' +
        //                         this.props.contractname +
        //                         '.pdf"  width="100%" height="100%" />'
        //                 });
        //             });
        //         } else {
        //             this.props.handleOpenSnackbar(
        //                 'error',
        //                 'Error: Loading agreement: createcontracts not exists in query data'
        //             );
        //             this.setState({
        //                 loadingData: false,
        //                 loadingContract: false
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         this.props.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
        //         this.setState({
        //             loadingData: false,
        //             loadingContract: false
        //         });
        //     });
    };

    loadAgreement = () => {
        this.setState({ loadingData: true });
        this.props.client
            .query({
                query: this.GET_AGREEMENT_QUERY,
                variables: { Id: this.props.contractId },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getcontracts != []) {
                    this.setState({
                        agreement: data.data.getcontracts[0].Contract_Terms
                        //signature: data.data.getcontracts[0].Client_Signature
                    });
                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: getcontracts not exists in query data'
                    );
                    this.setState({ loadingData: false });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
                this.setState({ loadingData: false });
            });
    };

    DEFAULT_STATE = {
        id: '',
        idToDelete: null,
        idToEdit: null,
        idDepartment: '',
        position: '',
        billrate: 0,
        payrate: 0,
        shift: '',

        idDepartmentValid: true,
        positionValid: true,
        billrateValid: true,
        payrateValid: true,
        shiftValid: true,

        idDepartmentHasValue: false,
        positionHasValue: false,
        billrateHasValue: false,
        payrateHasValue: false,
        shiftHasValue: false,

        formValid: true,
        opendialog: false,
        buttonTitle: this.TITLE_ADD,
        enableCancelButton: false,
        openSnackbar: true,
        loading: false,
        success: false,
        loadingConfirm: false,
        openModal: false
    };

    resetState = () => {
        this.setState(
            {
                ...this.DEFAULT_STATE
            },
            () => {
            }
        );
    };
    insertExhibit = () => {
        this.props.client.mutate({
            mutation: this.ADD_EXHIBIT,
            variables: {
                Id: parseInt(this.props.contractId),
                Exhibit_B: `'${this.state.exhibitB}'`,
                Exhibit_C: `'${this.state.exhibitC}'`,
                Exhibit_D: `'${this.state.exhibitD}'`,
                Exhibit_E: `'${this.state.exhibitE}'`,
                Exhibit_F: `'${this.state.exhibitF}'`
            }
        });
    };

    componentWillMount() {
        this.loadAgreement();
    }

    componentWillReceiveProps(nextProps) {
        console.log('cargando nuevo props', nextProps, this.props); // TODO: (LF) Quitar console log
    }

    componentDidMount() {
        document.getElementById('ifmcontentstoprint').style.display = 'none';
    }

    handleClickOpenModal = () => {
        this.createContract();
    };

    cancelContractHandler = () => {
        this.resetState();
    };

    downloadContractHandler = () => {
        //var url = 'https://corema-new-api.herokuapp.com/public/Contract_' + this.props.contractname + '.pdf';
        var url = 'localhost:4000/public/Contract_' + this.props.contractname + '.pdf';
        //pri.download();
        window.open(url, '_blank');
    };

    printContractHandler = () => {
        var content = document.getElementById('agreement');
        var pri = document.getElementById('ifmcontentstoprint').contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    };

    render() {
        const { loading, success } = this.state;
        const { classes } = this.props;
        const { fullScreen } = this.props;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: success
        });

        return (
            <div className="contract-container">
                <Dialog
                    fullScreen={true}
                    open={this.state.openModal}
                    onClose={this.cancelContractHandler}
                    aria-labelledby="responsive-dialog-title"
                    style={{ width: '90%', padding: '0px', margin: '0 auto' }}
                >
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            {' '}
                            {this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0 ? (
                                'Edit  Position/Rate'
                            ) : (
                                    <h5 className="modal-title">New Contract Preview</h5>
                                )}
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ minWidth: 750, padding: '0px' }}>
                        <div className="row">
                            <div className="col-md-12">
                                <button
                                    //	disabled={this.state.loading || !this.state.enableCancelButton}
                                    variant="fab"
                                    color="secondary"
                                    className={'btn btn-danger pull-right'}
                                    onClick={this.cancelContractHandler}
                                >
                                    Close <i class="fas fa-times"></i>
                                </button>
                                <button
                                    //	disabled={this.state.loading || !this.state.enableCancelButton}
                                    variant="fab"
                                    color="primary"
                                    className={'btn btn-info mr-1 pull-right'}
                                    onClick={this.sendContract}
                                >
                                    Send <i class="fas fa-envelope"></i>
                                </button>


                            </div>
                        </div>
                        <div id="agreement" className="exhibit-content">
                            {this.state.openModal && renderHTML(this.state.PdfUrl)}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className="exhibit-button-right">
                            {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                        </div>
                    </DialogActions>
                </Dialog>

                <PositionsCompanyForm
                    idCompany={this.props.companyId}
                    idContract={this.props.contractId}
                    handleOpenSnackbar={this.props.handleOpenSnackbar}
                    showStepper={false}
                />
                <div className="">
                    <div className="">
                        <div className="row">
                            <div className="col-md-12">
                                <button className={'btn btn-info mt-1'} onClick={this.handleClickOpenModal} disabled={this.state.loadingContract}>
                                    Create Contract {this.state.loadingContract && <i class="fas fa-spinner fa-spin  ml-1" />}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
                <iframe id="ifmcontentstoprint" allowtransparency="true" />
            </div>
        );
    }

    static contextTypes = {
        baseUrl: PropTypes.string
    };
}

export default withStyles(styles)(withApollo(withMobileDialog()(ExhibitContract)));
