import React, { Component } from "react";

class BankInfo extends Component{
    render(){
        return(
            <div className="card BankInfo">
                <div className="card-header">
                    Bank Information
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 col-xl-8">
                            <div className="BankInfo-inputWrapper">
                                <label htmlFor="Bank Name">* Bank Name</label>
                                <input type="text" name="Bank Name" id="Bank Name" className="form-control"/>
                            </div>
                            <div className="BankInfo-inputWrapper">
                                <label htmlFor="Routing Name">* Routing Name</label>
                                <input type="text" name="Routing Name" id="Routing Name" className="form-control"/>
                            </div>
                            <div className="BankInfo-inputWrapper">
                                <label htmlFor="Account Number">* Account Number</label>
                                <input type="text" name="Account Number" id="Account Number" className="form-control"/>
                            </div>
                        </div>                        
                        <div className="col-md-12 col-xl-4">
                            <label htmlFor="">Type of Account</label>

                            <div className="tumi-row-centered BankInfo-accountType">
                                <div className="tumi-row-centered BankInfo-checking">
                                    <input type="radio" id="checking" name="contact" value="checking"/>
                                    <label className='mt-0' for="checking">Checking</label>
                                </div>

                                <div className="tumi-row-centered BankInfo-saving">
                                    <input type="radio" id="Saving" name="contact" value="saving"/>
                                    <label className='mt-0' for="Saving">Saving</label>
                                </div>
                            </div>

                            <div className="BankInfo-Amount">
                                <div className="BankInfo-quantity">
                                    <label htmlFor="">* Amount</label>
                                    <div class="input-group">
                                        <span className="pr-1"><i class="fas fa-dollar-sign"></i></span>
                                        <div class="input-group-prepend">
                                            <input type="checkbox" name="quantity" id="quantity"/>
                                        </div>
                                        <input type="text" class="form-control"/>
                                    </div>
                                </div>

                                <div className="BankInfo-percentage">
                                    <span className="float-right tumi-checkbox-wrapper Location-changeCityByZip">
                                        <input 
                                            type="checkbox" 
                                            name="changeCity" 
                                            // onChange={this.onValueChange} 
                                            // disabled={this.props.disabledCheck || loading} 
                                            // checked={this.state.changeCity} 
                                        />

                                        <label htmlFor="changeCity">Entire Paycheck</label>
                                    </span>
                                    <div class="input-group">                                        
                                        <span className="pr-1"><i class="fas fa-percentage"></i></span>
                                        <div class="input-group-prepend">
                                            <input type="checkbox" name="percentage" id="percentage"/>
                                        </div>
                                        <input type="text" class="form-control"/>
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