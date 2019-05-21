import React, { Component } from "react";
import InputMask from 'react-input-mask';

class AccountHolder extends Component{
    constructor(props){
        super(props);

        this.state = {
            changeCity: false,
            city: '',
            loadingCities: false,
            cities: [],
            state: '',
            loadingStates: false,
            states: [],
            zipcode: ''
        }
    }

    onValueChange = () => {

    }

    render(){
        return (
            <div className="card">
                <div className="card-header">Account Holder Information</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <label htmlFor="firstName">* First Name</label>
                            <input type="text" name="firstName" id="firstName" className="form-control"/>
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="lastName">* Last Name</label>
                            <input type="text" name="lastName" id="lastName" className="form-control"/>
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="address">* Address</label>
                            <input type="text" name="address" id="address" className="form-control"/>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="mr-1">* City</label>
                            <span className="float-right tumi-checkbox-wrapper Location-changeCityByZip">
                                <input 
                                    type="checkbox" 
                                    name="changeCity" 
                                    // onChange={this.onValueChange} 
                                    // disabled={this.props.disabledCheck || loading} 
                                    // checked={this.state.changeCity} 
                                />

                                <label htmlFor="changeCity">Change selected city by zip code?</label>
                            </span>
                            <div className="select-animated">
                                <select 
                                    name="city" 
                                    className='form-control' 
                                    onChange={this.onValueChange} value={this.state.city}
                                    // disabled={!this.state.changeCity || this.state.loadingCities || this.props.disabledCity} 
                                    required>

                                    <option value="">Select a city</option>
                                    {/* {this.state.cities.map(({ Id, Name }) => (
                                        <option key={Id} value={Id}>{Name}</option>
                                    ))} */}
                                </select>
                                <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingCities || 'd-none'}`} />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="select-animated">
                                <label>* State</label>
                                <select 
                                    name="state" 
                                    className='form-control' 
                                    onChange={this.onValueChange} 
                                    value={this.state.state}
                                    disabled
                                    required>

                                    <option value="">Select a state</option>
                                    {/* {this.state.states.map(({ Id, Name }) => (
                                        <option key={Id} value={Id}>{Name}</option>
                                    ))} */}
                                </select>
                                <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingStates || 'd-none'}`} />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="zipCode">* Zip Code</label>
                            <InputMask
                                id="zipCode"
                                name="zipCode"
                                className="form-control"
                                // onChange={this.onValueChange}
                                value={this.state.zipcode}
                                placeholder='_____-_____'
                                required
                                minLength="15"
                                // onKeyDown={this.handleOnKeyUp}
                                // onBlur={this.handleOnBlur}
                            />
                        </div>                                            
                    </div>
                </div>
            </div>
        );
    }
};

export default AccountHolder;