import React, { Component } from "react";
import BankInfo from './BankInfo';
import AccountHolder from './AccountHolder';
import AccountDropdown from './AccountDropdown';
import ApplicantDocument from '../ApplyForm/Application/ApplicantDocuments/ApplicantDocument';

class DirectDeposit extends Component{
        
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
                        <BankInfo/>
                    </div>
                    <div className="col-md-12 col-xl-3">
                        <div className="card">
                            <div className="card-body">
                                <ApplicantDocument applicationId={1} />
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