import React, { Component } from "react";
import BankInfo from './BankInfo';
import AccountHolder from './AccountHolder';
import AccountDropdown from './AccountDropdown';
import {INSERT_ACCOUNT_INFO} from './Mutations';
import withApollo from 'react-apollo/withApollo';
import Attachments from "./Attachments";

const dummyDocData = [
    { applicationAccountId: 0, path: 'www.host.com/', name: 'checkCopy', extension: '.jpg' },
    { applicationAccountId: 0, path: 'www.host.com/', name: 'certification', extension: '.docx' },
    { applicationAccountId: 0, path: 'www.host.com/', name: 'checkCopy', extension: '.png' }
]

class DirectDeposit extends Component{
    INITIAL_STATE = {
        zipcode: '',
        city: '',
        state: '',
        firstName: '',
        lastName: '',
        address: '',
        bankName: '',
        routingName: '',
        account: '',  
        amount: '',
        percentage: '',
        accountType: '',
        amountType: '',
        accountDocumentsInfo: [],
    }

    constructor(props){
        super(props);

        this.state = {
            ...this.INITIAL_STATE,
            // applicationId: this.props.applicationId
            applicationId: 204
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.type == 'checkbox' ? e.target.checked : e.target.value });        
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

    handleSubmit = e => {
        e.preventDefault();
        
        const { firstName, lastName, city, state, zipcode, bankNumber, accountNumber, routingNumber, accountType, amount, amountType, percentage } = this.state;
        console.log(this.state);

        const amountToSave = accountType === 'quantity' ? amount : percentage;

        // this.props.client.mutate({
        //     mutation: INSERT_ACCOUNT_INFO,
        //     variables: {
        //         input: {
        //            applicationId: 0,
        //            firstName,
        //            lastName,
        //            city,
        //            state,
        //            zipcode: parseInt(zipcode),
        //            bankNumber,
        //            accountNumber,
        //            routingNumber,
        //            accountType, 
        //            amount: amountToSave,
        //            amountType
        //         },

        //         documents: this.dummyDocData
        //     }
        // })
        // .then(data => alert('success'))
        // .catch(error => alert(error)); 
    }
        
    render(){
        return(
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-md-12 col-xl-5">
                            <div className="card">
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
                                routingName={this.state.routingName}
                                account={this.state.account}
                                amount={this.state.amount}
                                accountType={this.state.accountType}
                                setAmountType={this.setAmountType}
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
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <AccountDropdown/>                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withApollo(DirectDeposit);