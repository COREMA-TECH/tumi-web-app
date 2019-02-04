import React, { Component } from 'react';
import InputMask from 'react-input-mask';
import axios from 'axios';
import withApollo from 'react-apollo/withApollo';
import { GET_CATALOGS_QUERY } from './queries';

const STATE_ID = 3, CITY_ID = 5,
    DEFAULT_MASK = '99999', DEFAULT_PLACEHOLDER = '99999',
    DEFAULT_STATE_CODE = 'XYZ';

class LocationForm extends Component {
    INITIAL_STATE = {
        city: '',
        cityName: '',
        state: '',
        stateCode: DEFAULT_STATE_CODE,
        states: [],
        cities: [],
    }
    constructor() {
        super();
        this.state = {
            zipCode: '',
            changeCity: false,
            ...this.INITIAL_STATE
        }
    }

    loadStates = () => {
        this.setState({ loadingStates: true },
            () => {
                this.props.client
                    .query({
                        query: GET_CATALOGS_QUERY,
                        fetchPolicy: 'no-cache',
                        variables: {
                            Id_Catalog: STATE_ID,
                            Value: this.state.stateCode || DEFAULT_STATE_CODE
                        }
                    }).then(({ data: { catalogitem } }) => {
                        this.setState({ states: catalogitem, loadingStates: false },
                            () => {
                                if (catalogitem.length > 0)
                                    this.setState({ state: catalogitem[0].Id },
                                        () => {
                                            this.loadCities();
                                        })
                            })
                    }).catch(error => {
                        this.setState({ loadingStates: false })
                    })
            })
    }

    loadCities = () => {
        this.setState({ loadingCities: true },
            () => {
                this.props.client
                    .query({
                        query: GET_CATALOGS_QUERY,
                        fetchPolicy: 'no-cache',
                        variables: {
                            Id_Catalog: CITY_ID,
                            Id_Parent: this.state.state || 0
                        }
                    }).then(({ data: { catalogitem } }) => {
                        this.setState({ cities: catalogitem, loadingCities: false },
                            () => {
                                var selectedCity = this.state.cities.find(item => item.Name.toLowerCase().trim().includes(this.state.cityName.toLowerCase().trim()))
                                if (selectedCity)
                                    this.setState({ city: selectedCity.Id })
                            })
                    }).catch(error => {
                        this.setState({ loadingCities: false })
                    })
            })

    }

    onValueChange = (e) => {
        this.setState({ [e.target.name]: e.target.type == 'checkbox' ? e.target.checked : e.target.value })

        if (e.target.name == "zipCode") {
            this.setState({ ...this.INITIAL_STATE });
        }
    }

    findZipCode = () => {
        //Get firts five characters of Zipcode input
        const zipCode = this.state.zipCode.trim().replace('-', '').substring(0, 5);
        this.setState({ findingZipCode: true }, () => {
            if (zipCode)
                axios.get(`https://ziptasticapi.com/${zipCode}`)
                    .then(res => {
                        const cities = res.data;
                        if (!cities.error) {
                            this.setState({ stateCode: cities.state, cityName: cities.city.toLowerCase() },
                                () => { this.loadStates(); })
                        }
                        this.setState({ findingZipCode: false })
                    }).catch(error => { this.setState({ findingZipCode: false }) })
        })

    }

    handleOnKeyUp = (e) => {
        if (e.keyCode == 13 || e.keyCode == 9)
            this.findZipCode()
    }

    render() {
        return <React.Fragment>
            <div className="col-md-6 col-lg-4">
                <label className="mr-1">* City</label>
                <span className="float-right">
                    <input type="checkbox" name="changeCity" onChange={this.onValueChange} />
                    <label htmlFor="">Change selected city by zip code?</label>
                </span>
                <div className="select-animated">
                    <select name="city" className='form-control' onChange={this.onValueChange} value={this.state.city}
                        disabled={!this.state.changeCity || this.state.loadingStates} required>
                        <option value="">Select a city</option>
                        {this.state.cities.map(({ Id, Name }) => (
                            <option key={Id} value={Id}>{Name}</option>
                        ))}
                    </select>
                    <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingCities || 'd-none'}`} />
                </div>
            </div>
            <div className="col-md-6 col-lg-4">
                <div className="select-animated">
                    <label>* State</label>
                    <select name="state" className='form-control' onChange={this.onValueChange} value={this.state.state}
                        disabled required>
                        <option value="">Select a state</option>
                        {this.state.states.map(({ Id, Name }) => (
                            <option key={Id} value={Id}>{Name}</option>
                        ))}
                    </select>
                    <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingStates || 'd-none'}`} />
                </div>
            </div>
            <div className="col-md-6 col-lg-4">
                <label>* Zip Code</label>
                <InputMask
                    id="zipCode"
                    name="zipCode"
                    mask={this.props.mask || DEFAULT_MASK}
                    maskChar=""
                    className="form-control"
                    onChange={this.onValueChange}
                    value={this.state.zipCode}
                    placeholder={this.props.placeholder || DEFAULT_PLACEHOLDER}
                    required
                    minLength="15"
                    disabled={this.state.loadingCities || this.state.loadingStates || this.state.findingZipCode}
                    onKeyDown={this.handleOnKeyUp}
                />
            </div>
        </React.Fragment>
    }
}

export default withApollo(LocationForm);