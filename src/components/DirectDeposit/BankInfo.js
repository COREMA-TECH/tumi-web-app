import React, { Component } from "react";

class BankInfo extends Component{
    INITIAL_STATE = {
        quantityDisabled: true,
        percentageDisabled: true
    }

    constructor(props){
        super(props);

        this.state = {                      
            ...this.INITIAL_STATE
        }
    }    

    enablePercentage = _ => {
        this.setState( (prevState, props) => {
            return {
                percentageDisabled: false,
                quantityDisabled: true
            }
        });
    }

    enableQuantity = _ => {
        this.setState( (prevState, props) => {
            return {
                percentageDisabled: true,
                quantityDisabled: false
            }
        });
    }

    render(){
        return(
            <div className="card BankInfo">
                <div className="card-header">
                    Bank Information
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 col-lg-6 col-xl-8">
                            <div className="BankInfo-inputWrapper">
                                <label htmlFor="bankName">* Bank Name</label>
                                <input type="text" name="bankName" value={this.props.bankName} id="Bank Name" className="form-control" onChange={this.props.handleOnChange}/>
                            </div>
                            <div className="BankInfo-inputWrapper">
                                <label htmlFor="routingName">* Routing Name</label>
                                <input type="text" name="routingName" value={this.props.routingName} id="Routing Name" className="form-control" onChange={this.props.handleOnChange}/>
                            </div>
                            <div className="BankInfo-inputWrapper">
                                <label htmlFor="account">* Account Number</label>
                                <input type="text" name="account" value={this.props.account} id="Account Number" className="form-control" onChange={this.props.handleOnChange}/>
                            </div>
                        </div>                        
                        <div className="col-md-12 col-lg-6 col-xl-4">
                            <label htmlFor="">Type of Account</label>

                            <div className="tumi-row-centered BankInfo-accountType">
                                <div className="tumi-row-centered BankInfo-checking">
                                    <input type="radio" id="checking" name="accountType" value="checking" onChange={this.props.handleOnChange}/>
                                    <label className='mt-0' for="checking">Checking</label>
                                </div>

                                <div className="tumi-row-centered BankInfo-saving">
                                    <input type="radio" id="Saving" name="accountType" value="saving" onChange={this.props.handleOnChange}/>
                                    <label className='mt-0' for="Saving">Saving</label>
                                </div>
                            </div>

                            <div className="BankInfo-amount">
                                <div className="BankInfo-quantity">
                                    <label htmlFor="">* Amount</label>
                                    <div class="input-group">
                                        <span className="pr-1"><i class="fas fa-dollar-sign"></i></span>
                                        <div class="input-group-prepend">
                                            <input type="checkbox" name="quantity" checked={!this.state.quantityDisabled} id="quantity" onChange={this.enableQuantity}/>
                                        </div>
                                        <input type="text" name="amount" value={this.props.amount} class="form-control" disabled={this.state.quantityDisabled} onChange={this.props.handleOnChange}/>
                                    </div>
                                </div>

                                <div className="BankInfo-percentage">
                                    <span className="float-right tumi-checkbox-wrapper Location-changeCityByZip">
                                        <input 
                                            type="checkbox" 
                                            name="changeCity" 
                                        />
                                        
                                        <label htmlFor="changeCity">Entire Paycheck</label>
                                    </span>
                                    <div class="input-group">                                        
                                        <span className="pr-1"><i class="fas fa-percentage"></i></span>
                                        <div class="input-group-prepend">
                                            <input type="checkbox" name="percentage" checked={!this.state.percentageDisabled} id="percentage" onChange={this.enablePercentage}/>
                                        </div>
                                        <input type="text" name="percentage" value={this.props.percentage} class="form-control" disabled={this.state.percentageDisabled} onChange={this.props.handleOnChange}/>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        );
    }
};

export default BankInfo;