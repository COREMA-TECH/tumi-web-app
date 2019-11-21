import React, { Fragment, Component, memo } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import {OffsideModal, OffsideModalTitle, OffsideModalContent, OffsideModalFooter} from '../../ui-components/OffsideModal';
import { GET_POSITIONS_QUERY } from '../../ApplyForm-Recruiter/Queries';
import { CREATE_APPLICATION } from './Mutations';
import {Route} from "react-router-dom";
import Redirect from 'react-router-dom/es/Redirect';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../Generic/Global';
import moment from 'moment';
import InputMask from 'react-input-mask';
import ZipCodeInfo from '../../ui-components/ZipCodeInfo';

/**
 * Custom Switch
 * @param {*} id
 * @param {*} className
 * @param {*} onChange
 * @param {*} checked
 * @param {*} value
 * @param {*} name
 * @param {*} disabled
 */
const CustomSwitch = props => {
    const {id, className, onChange, checked, value, name, disabled} = props;
    return (
        <div className="onoffswitch">
            <input
                id={id}
                className={`onoffswitch-checkbox ${className}`}
                onChange={onChange}
                checked={checked}
                value={value}
                name={name}
                type="checkbox"
                disabled={!!disabled}
                min="0"
                maxLength="50"
                minLength="10"
            />
            <label className="onoffswitch-label" htmlFor={id}>
                <span className="onoffswitch-inner" />
                <span className="onoffswitch-switch" />
            </label>
        </div>
    )
};

const DEFAULT_STATE = {
    positionAppyinForSelected: {value:0, label: 'empty'},
    firstName: '',
    middleName: '',
    lastName: '',
    homePhone: '',
    zipCode: '',
    zipCodeDir: '',
    proofofId: false,
    workonWeekends: false,
    transportation: false,
    speakEnglish: false
}


class QuickLeadCreation extends Component {
    state = {
        userId: 0,
        nameUser: null,
        redirecttoDetailView: false,
        leadId: 0,
        openOffsideModal: true,
        insertLoading: false,
        positionsOpt: [],
        ...DEFAULT_STATE
    };

    getPositions = () => {
        this.props.client
            .query({
                query: GET_POSITIONS_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if(data.workOrder && data.workOrder.length){
                    console.log('data.workOrder', data.workOrder); // TODO: (LF) QUITAR CONSOLE LOG 
                    const positions = data.workOrder.map(item => {
                        return { value: item.id, label: `${item.position.Position.trim()} ${item.BusinessCompany.Code.trim()}` }
                    });

                    const optionstoAdd = [
                        { value: '', label: "Select a Position" },
                        { value: 0, label: "Open Position" },
                        ...positions
                    ];

                    console.log('optionstoAdd', optionstoAdd); // TODO: (LF) QUITAR CONSOLE LOG 

                    this.setState({
                        positionsOpt: optionstoAdd
                    });
                }
                else {
                    this.setState({ positionsOpt: [] });
                }
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to show applicant information. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };

    /**
     * save new lead
     * @param {boolean} gotoDetails Redirect to detail view after saving
     */
    insertLead = (gotoDetails) => {
        const {userId, nameUser} = this.state;
        const currentDate = moment().format('L'); // MM/DD/YYY
        if (
            !this.state.firstName ||
            !this.state.lastName ||
            !this.state.zipCode 
        ) {
            this.props.handleOpenSnackbar('warning', 'the first name, last name, Zipcode are required');
        } else {
            this.setState(
                {
                    insertLoading: true
                },
                () => {
                    this.props.client
                        .mutate({
                            mutation: CREATE_APPLICATION,
                            variables: {
                                application: {
                                    firstName: this.state.firstName,
                                    middleName: this.state.middleName,
                                    lastName: this.state.lastName,
                                    //lastName2: this.state.lastName2,
                                    date: currentDate,
                                    dateCreation: currentDate,
                                    //aptNumber: this.state.aptNumber,
                                    city: this.state.city,
                                    state: this.state.state,
                                    zipCode: this.state.zipCode,
                                    homePhone: this.state.homePhone,
                                    //cellPhone: this.state.cellPhone,
                                    //car: this.state.car,
                                    //emailAddress: this.state.emailAddress,
                                    positionApplyingFor: this.state.positionAppyinForSelected.value,
                                    //scheduleRestrictions: this.state.scheduleRestrictions,
                                    //scheduleExplain: this.state.scheduleExplain,
                                    //convicted: this.state.convicted,
                                    //convictedExplain: this.state.convictedExplain,
                                    //comment: this.state.comment,
                                    //generalComment: this.state.generalComment,
                                    //isLead: true,
                                    idRecruiter: userId,
                                    UserId: userId,
                                    sendInterview: false,
                                    origin: 'Recruiter'
                                },
                                codeuser: userId,
                                nameUser: nameUser
                            }
                        })
                        .then(({ data }) => {
                            if(data.addLead){
                                this.setState({
                                    insertLoading: false
                                });
                                this.clearForm();
                                this.props.handleOpenSnackbar('success', 'Successfully inserted', 'bottom', 'right');
                                if(gotoDetails) this.setState({ redirecttoDetailView: true, leadId: data.addLead.id });
                            }
                        })
                        .catch((error) => {
                            this.setState(() => ({ insertLoading: false }));
                            this.props.handleOpenSnackbar(
                                'error',
                                'Error to insert lead information. Please, try again!',
                                'bottom',
                                'right'
                            );
                        });
                }
            );
        }
    };

    handleTextBoxChange = ({currentTarget: {name, value}}) => this.setState({[name]: value});

    handleZipCodeChange = (value) => this.setState({zipCode: '78741-'});

    handleSwitchChange = (isChecked, keyName) => {
        console.log('handleSwitchChange', isChecked, keyName); // TODO: (LF) QUITAR CONSOLE LOG
        this.setState({[keyName]: !isChecked});
    }

    clearForm = () => this.setState({ ...DEFAULT_STATE });

    handleRedirecttoDetailView = () => {
        return <Redirect
                    to={{
                        pathname: '/home/application/Form',
                        state: { ApplicationId: this.state.leadId }
                    }}
                />
    }

    handleCloseOffsideModal = () => this.setState({openOffsideModal: false});

    componentDidMount = () => {
        this.getPositions();
        this.setState({
            userId: localStorage.getItem('LoginId'),
            nameUser: localStorage.getItem('FullName')
        })
    }

    render() {
        const { positionAppyinForSelected, firstName, middleName, lastName, homePhone, zipCode,
                zipCodeDir, proofofId, workonWeekends, transportation, speakEnglish, positionsOpt } = this.state;

        console.log('render de Quick lead creation'); // TODO: (LF) QUITAR CONSOLE LOG

        if(this.state.redirecttoDetailView) return this.handleRedirecttoDetailView();

        return <Fragment>
            {console.log('render de Quick lead creation <Fragment />') /* TODO: (LF) QUITAR CONSOLE LOG*/ }
            <button onClick={_ => this.setState({openOffsideModal: true})}>abrir modal</button>
            <OffsideModal open={this.state.openOffsideModal} handleClose={this.handleCloseOffsideModal}>
                <OffsideModalTitle>New Lead</OffsideModalTitle>
                <OffsideModalContent>
                    <div className="row d-flex align-items-end">
                        <div className="col-md-12">
                            <span>
                                Position Applying For
                            </span>
                            <Select
                                options={positionsOpt}
                                value={positionAppyinForSelected}
                                onChange={{}}
                                closeMenuOnSelect={true}
                                components={makeAnimated()}
                            />
                        </div>
                        
                        <div className="col-md-12 mt-3">
                            <span>
                                First Name
                            </span>
                            <input
                                onChange={this.handleTextBoxChange}
                                value={firstName}
                                name="firstName"
                                type="text"
                                className="form-control"
                                disabled={false}
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                        
                        <div className="col-md-12 mt-3">
                            <span>
                                Middle Name
                            </span>
                            <input
                                onChange={this.handleTextBoxChange}
                                value={middleName}
                                name="middleName"
                                type="text"
                                className="form-control"
                                disabled={false}
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                        
                        <div className="col-md-12 mt-3">
                            <span>
                                Last Name
                            </span>
                            <input
                                onChange={this.handleTextBoxChange}
                                value={lastName}
                                name="lastName"
                                type="text"
                                className="form-control"
                                disabled={false}
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                        
                        <div className="col-md-12 mt-3">
                            <span>
                                Phone Number
                            </span>
                            <InputMask
                                id="homePhone"
                                name="homePhone"
                                mask="+(999) 999-9999"
                                maskChar=" "
                                value={homePhone}
                                className="form-control"
                                disabled={this.state.insertLoading}
                                onChange={this.handleTextBoxChange}
                                placeholder="+(___) ___-____"
                                minLength="15"
                            />
                            {/* <input
                                onChange={this.handleTextBoxChange}
                                value={homePhone}
                                name="homePhone"
                                type="text"
                                className="form-control"
                                disabled={false}
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            /> */}
                        </div>
                        
                        <div className="col-md-12 mt-3">
                            <span>
                                Zip Code
                            </span>
                            <ZipCodeInfo
                                
                            />
                            {/* <input
                                onChange={this.handleZipCodeChange}
                                value={zipCode}
                                name="zipCode"
                                type="text"
                                className="form-control"
                                disabled={false}
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            /> */}
                        </div>
                        
                        {/* <div className="col-md-8">
                            <input
                                value={zipCodeDir}
                                name="zipCodeDir"
                                type="text"
                                className="form-control"
                                disabled={true}
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div> */}
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="QuickLeadCreationTable">
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>
                                                Proof of ID
                                            </td>
                                            <td>
                                                <CustomSwitch
                                                    id="proofofId"
                                                    onChange={_ => this.handleSwitchChange(proofofId, 'proofofId')}
                                                    checked={proofofId}
                                                    value={proofofId}
                                                    name="proofofId"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Able to work on weekends
                                            </td>
                                            <td>
                                                <CustomSwitch
                                                    id="workonWeekends"
                                                    onChange={_ => this.handleSwitchChange(workonWeekends, 'workonWeekends')}
                                                    checked={workonWeekends}
                                                    value={workonWeekends}
                                                    name="workonWeekends"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Do You have Transportation
                                            </td>
                                            <td>
                                                <CustomSwitch
                                                    id="transportation"
                                                    onChange={_ => this.handleSwitchChange(transportation, 'transportation')}
                                                    checked={transportation}
                                                    value={transportation}
                                                    name="transportation"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Speaks English
                                            </td>
                                            <td>
                                                <CustomSwitch
                                                    id="speakEnglish"
                                                    onChange={_ => this.handleSwitchChange(speakEnglish, 'speakEnglish')}
                                                    checked={speakEnglish}
                                                    value={speakEnglish}
                                                    name="speakEnglish"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </OffsideModalContent>
                <OffsideModalFooter>
                    <button 
                        className="btn btn-success"
                        onClick={_ => this.insertLead(true)}
                        >Create Contact
                    </button>
                    
                    <button 
                        className="btn btn-success"
                        onClick={_ => this.insertLead(false)}
                        >Create and add Another
                    </button>
                    
                    <button 
                        className="btn border-success"
                        onClick={this.handleCloseOffsideModal}
                        >Cancel
                    </button>
                </OffsideModalFooter>
            </OffsideModal>
        </Fragment>
    }
}

export default withGlobalContent(withApollo(QuickLeadCreation));
