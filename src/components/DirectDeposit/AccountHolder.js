import React, { Component } from "react";
import InputMask from 'react-input-mask';
import LocationForm from '../ui-components/LocationForm'

class AccountHolder extends Component{
    INITIAL_STATE = {
        zipCode: '',
        city: '',
        state: ''      
    }

    constructor(props){
        super(props);

        this.state = {
            ...this.INITIAL_STATE
        }
    }

    updateInput = (text, name) => {
		this.validateField(name, text);
    };
    
    validateField(fieldName, value) {
		this.setState(
			(prevState) => {

				let codeValid = prevState.codeValid;
				let nameValid = prevState.nameValid;
				let addressValid = prevState.addressValid;

				let startWeekValid = prevState.startWeekValid;
				let endWeekValid = prevState.endWeekValid;
				let rateValid = prevState.rateValid;
				let zipCodeValid = prevState.zipCodeValid;
				let countryValid = prevState.countryValid;
				let stateValid = prevState.stateValid;

				let cityValid = prevState.cityValid;
				let phoneNumberValid = prevState.phoneNumberValid;
				let faxValid = prevState.faxValid;
				let startDateValid = prevState.startDateValid;
				let phonePrefixValid = prevState.phonePrefixValid;

				switch (fieldName) {
					case 'Code':
						codeValid = value.trim().length >= 2;

						break;
					case 'name':
						nameValid = value.trim().length >= 5;

						break;
					case 'address':
						addressValid = value.trim().length >= 5;

						break;
					case 'startWeek':
						startWeekValid = value !== null && value !== 0 && value !== '';

						break;
					case 'endWeek':
						endWeekValid = value !== null && value !== 0 && value !== '';

						break;
					case 'rate':
						rateValid = parseInt(value) >= 0;

						break;
					case 'zipCode':

						zipCodeValid = value.trim().length >= 2;
						break;
					case 'country':
						countryValid = value !== null && value !== 0 && value !== '';

						break;
					case 'state':
						stateValid = value !== null && value !== 0 && value !== '';
						break;
					case 'city':
						cityValid = value !== null && value !== 0 && value !== '';
						break;
					case 'phoneNumber':
						phoneNumberValid =
							value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
								.length == 10;
						break;
					case 'phonePrefix':
						let phonePrefix = value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '');
						phonePrefixValid = phonePrefix.length == 10 || phonePrefix.length == 0;
						break;
					case 'fax':
						let fax = value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '');
						faxValid = fax.length == 10 || fax.length == 0;
						break;
					case 'startDate':
						startDateValid = value.trim().length == 10;
						break;
					default:
						break;
				}

				return {
					codeValid,
					nameValid,
					addressValid,
					startWeekValid,
					endWeekValid,
					rateValid,
					zipCodeValid,
					countryValid,
					stateValid,
					cityValid,
					phoneNumberValid,
					faxValid,
					startDateValid,
					phonePrefixValid,
					[fieldName]: value,
					formValid:
						codeValid &&
						nameValid &&
						addressValid &&
						startWeekValid &&
						endWeekValid &&
						rateValid &&
						zipCodeValid &&
						countryValid &&
						stateValid &&
						phoneNumberValid &&
						faxValid &&
						phonePrefixValid
				}
			}, _ => { 				
				this.props.handleLocationFormChange(this.state.zipCode, this.state.city, this.state.state)
			});
    }
    
    updateSearchingZipCodeProgress = (searchigZipcode) => {
		this.setState(() => {
			return { searchigZipcode }
		})
    }

    updateState = (id) => {
		this.setState(
			{
				state: id,
				city: 0
			},
			() => {
				this.validateField('state', id);
				// this.props.handleLocationFormChange('state', id);
			}
		);
	};

	updateCity = (id) => {
		this.validateField('city', id);
		// this.props.handleLocationFormChange('city', id)
	};    
	
	onChangeZipcode = (text) => { 
		this.updateInput(text, 'zipCode');		
	}
    
    render(){
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <label htmlFor="firstName">* First Name</label>
                        <input type="text" name="firstName" id="firstName" onChange={this.props.handleChange} value={this.props.firstName} className="form-control"/>
                    
                        <label htmlFor="lastName">* Last Name</label>
                        <input type="text" name="lastName" id="lastName" onChange={this.props.handleChange} value={this.props.lastName} className="form-control"/>
                    
                        <label htmlFor="address">* Address</label>
                        <input type="text" name="address" id="address" onChange={this.props.handleChange} value={this.props.address} className="form-control"/>
                    </div>

                    <div className="col-12 col-md-6 tumi-noPadding">
                        <LocationForm
                            disabledCheck={true}
                            disabledCity={true}
                            disabledZipCode={false}
                            onChangeCity={this.updateCity}
                            onChangeState={this.updateState}
                            onChageZipCode={this.onChangeZipcode}
                            city={this.state.city}
                            state={this.state.state}
                            zipCode={this.state.zipCode} changeCity={this.state.changeCity}
                            cityClass={`form-control ${!this.state.cityValid && ' _invalid'}`}
                            stateClass={`form-control ${!this.state.stateValid && ' _invalid'}`}
                            zipCodeClass={`form-control ${!this.state.zipCodeValid && ' _invalid'}`}
                            cityColClass="col-12"
                            stateColClass="col-12"
                            zipCodeColClass="col-12"
                            requiredCity={true}
                            requiredState={true}
                            requiredZipCode={true}
                            updateSearchingZipCodeProgress={this.updateSearchingZipCodeProgress} />                            
                    </div>                                            
                </div>
            </React.Fragment>   
        );
    }
};

export default AccountHolder;