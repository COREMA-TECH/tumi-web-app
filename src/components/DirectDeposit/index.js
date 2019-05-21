import React, { Component } from "react";
import BankInfo from './BankInfo';
import AccountHolder from './AccountHolder';
import AccountDropdown from './AccountDropdown';

class DirectDeposit extends Component{
    render(){
        return(
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 col-xl-5">
                        <AccountHolder/>
                    </div>
                    <div className="col-md-12 col-xl-4">
                        <BankInfo/>
                    </div>
                    <div className="col-md-12 col-xl-3"></div>
                </div>                
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="col-12 col-md-4 pl-0">
                                    <AccountDropdown />
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