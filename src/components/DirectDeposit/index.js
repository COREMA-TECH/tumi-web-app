import React, { Component } from "react";
import BankInfo from './BankInfo';
import AccountHolder from './AccountHolder';
import AccountDropdown from './AccountDropdown';

class DirectDeposit extends Component{
    INITIAL_STATE = {
        zipCode: '',
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
        accountType: ''      
    }

    constructor(props){
        super(props);

        this.state = {
            ...this.INITIAL_STATE
        }
    }

    handleOnChange = e => {
        this.setState({ [e.target.name]: e.target.type == 'checkbox' ? e.target.checked : e.target.value });        
    }
        
    render(){
        return(
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 col-xl-5">
                        <div className="card">
                            <div className="card-header">
                                Account Holder Information
                            </div>
                            <div className="card-body">
                                <AccountHolder/>
                            </div>            
                        </div>                        
                    </div>
                    <div className="col-md-12 col-xl-4">
                        <BankInfo
                            handleOnChange={this.handleOnChange}
                            bankName={this.state.bankName}
                            routingName={this.state.routingName}
                            account={this.state.account}
                            amount={this.state.amount}
                            percentage={this.state.percentage}
                        />
                    </div>
                    <div className="col-md-12 col-xl-3">
                        <div className="card">
                            <div className="card-body">
                            </div>
                        </div>
                    </div>
                </div>                
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

export default DirectDeposit;