import React, { Component } from "react";
import BankInfo from './BankInfo';
import AccountHolder from './AccountHolder';
import AccountDropdown from './AccountDropdown';
import {INSERT_ACCOUNT_INFO} from './Mutations';
import {GET_APPLICATION_ACCOUNTS} from './Queries';
import withApollo from 'react-apollo/withApollo';
import Attachments from "./Attachments";
import withGlobalContent from "../Generic/Global";

class DirectDeposit extends Component{
    INITIAL_STATE = {
        zipcode: '',
        city: '',
        state: '',
        firstName: '',
        lastName: '',
        address: '',
        bankName: '',
        routingNumber: '',
        account: '',  
        amount: '',
        percentage: '',
        accountType: '',
        amountType: '',
        accountDocumentsInfo: [
            { applicationAccountId:0, path: 'www.host.com/', name: 'checkCopy', extension: '.jpg' },
            { applicationAccountId:0, path: 'www.host.com/', name: 'certification', extension: '.docx' },
            { applicationAccountId:0, path: 'www.host.com/', name: 'checkCopy', extension: '.png' }
        ],
        applicationAccounts: []
    }

    constructor(props){
        super(props);

        this.state = {
            ...this.INITIAL_STATE,                        
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ applicationId: nextProps.applicationId });
    }

    componentWillMount() {
        this.getApplicationAccounts();
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.type == 'checkbox' ? e.target.checked : e.target.value });        
    }

    handleFullPaycheckSelected = _ => {
        this.setState(_ => {
            return {
                percentage: 100,
                amountType: 'percentage'
            }
        })
    }

    handleLocationFormChange = (zipcode, city, state) => {
        this.setState( (prevState, props) => {
            return { zipcode, city, state }
        })
    }

    setAmountType = amountType => {
        this.setState(_ => {
            return { amountType }
        });
    }

    getApplicationAccounts = _ => {
        this.props.client.query({
            query: GET_APPLICATION_ACCOUNTS,
            variables: { applicationId: this.props.applicationId },
            fetchPolicy: 'no-cache'
        })
        .then(({data}) => {
            this.setState({ applicationAccounts: data.applicationAccounts });
        })
        .catch(error => console.log(error));
    }

    handleSubmit = e => {
        e.preventDefault();
        
        const { firstName, lastName, city, state, zipcode, bankName, account, routingNumber, accountType, amount, amountType, percentage, accountDocumentsInfo, address } = this.state;
        const amountToSave = amountType === 'quantity' ? amount : percentage;

        this.props.client.mutate({
            mutation: INSERT_ACCOUNT_INFO,
            variables: {
                input: {
                   applicationId: this.props.applicationId,
                   firstName,
                   lastName,
                   city,
                   state,
                   zipcode: parseInt(zipcode),
                   bankName,
                   accountNumber: parseInt(account),
                   routingNumber: parseInt(routingNumber),
                   accountType, 
                   amount: amountToSave,
                   amountType,
                   address
                },

                documents: accountDocumentsInfo
            }
        })
        .then(_ => {
            this.props.handleOpenSnackbar(
                'success',
                'Saved Successfully',
                'bottom',
                'center'
            );
        })
        .catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                `Error: ${error}`,
                'bottom',
                'center'
            );
        }); 
    }
        
    render(){
        return(
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-12 col-xl-5">
                            <div className="card AccountHolder">
                                <div className="card-header">
                                    Account Holder Information
                                </div>
                                <div className="card-body">
                                    <AccountHolder
                                        handleChange={this.handleChange}
                                        firstName={this.state.firstName}
                                        lastName={this.state.lastName}
                                        address={this.state.address}
                                        handleLocationFormChange={this.handleLocationFormChange}
                                    />
                                </div>            
                            </div>                        
                        </div>
                        <div className="col-md-12 col-xl-4">
                            <BankInfo
                                handleChange={this.handleChange}
                                bankName={this.state.bankName}
                                routingNumber={this.state.routingNumber}
                                account={this.state.account}
                                amount={this.state.amount}
                                accountType={this.state.accountType}
                                setAmountType={this.setAmountType}
                                address={this.address}
                                handleFullPaycheckSelected={this.handleFullPaycheckSelected}
                                percentage={this.state.percentage}
                            />
                        </div>
                        <div className="col-md-12 col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <Attachments />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className='btn btn-success tumi-saveBtn right' value='submit'>Save</button>
                    </div>      
                </form>                          
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    {
                                        this.state.applicationAccounts.map(item => {
                                            return (
                                                <div className="col-12 col-md-4">
                                                    <AccountDropdown
                                                        firstName={item.firstName}
                                                        lastName={item.lastName}
                                                        accountNumber={item.accountNumber}
                                                        address={item.address}
                                                        routingNumber={item.routingNumber}
                                                        accountType={item.accountType}
                                                        amount={item.amount}
                                                        amountType={item.amountType}
                                                    />                                    
                                                </div>  
                                            );
                                        })
                                    }                                                                                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withApollo(withGlobalContent(DirectDeposit));