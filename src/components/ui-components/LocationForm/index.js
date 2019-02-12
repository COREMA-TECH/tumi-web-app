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
    constructor(props) {
        super(props);
        this.state = {
            zipCode: '',
            changeCity: false,
            ...this.INITIAL_STATE,
            firstLoadStates: true,
            firstLoadCities: true
        }
    }

    loadFirstStates = (Id, city) => {
        this.setState({ loadingStates: true },
            () => {
                this.props.updateSearchingZipCodeProgress(true)
                this.props.client
                    .query({
                        query: GET_CATALOGS_QUERY,
                        fetchPolicy: 'no-cache',
                        variables: {
                            Id_Catalog: STATE_ID,
                            Id: Id || 0
                        }
                    }).then(({ data: { catalogitem } }) => {
                        this.setState(() => { return { states: catalogitem, loadingStates: false, state: Id } },
                            () => {
                                this.props.updateSearchingZipCodeProgress(false)
                                this.loadFirstCities(Id, city)
                            })
                    }).catch(error => {
                        this.setState(() => { return { loadingStates: false } }, () => {
                            this.props.updateSearchingZipCodeProgress(false)
                        })
                    })
            })
    }



    loadStates = () => {
        this.setState({ loadingStates: true },
            () => {
                this.props.updateSearchingZipCodeProgress(true)
                this.props.client
                    .query({
                        query: GET_CATALOGS_QUERY,
                        fetchPolicy: 'no-cache',
                        variables: {
                            Id_Catalog: STATE_ID,
                            Value: this.state.stateCode || DEFAULT_STATE_CODE
                        }
                    }).then(({ data: { catalogitem } }) => {
                        this.setState({ states: catalogitem, loadingStates: false, findingZipCode: false },
                            () => {
                                if (catalogitem.length > 0)
                                    this.setState({ state: catalogitem[0].Id }, () => {
                                        this.props.updateSearchingZipCodeProgress(false)
                                        this.props.onChangeState(this.state.state)
                                        this.loadCities()
                                    })
                            })
                    }).catch(error => {
                        this.setState({ loadingStates: false, findingZipCode: false }, () => {
                            this.props.updateSearchingZipCodeProgress(false)
                        })
                    })
            })
    }

    loadFirstCities = (Id_Parent, Id) => {
        this.setState({ loadingCities: true },
            () => {
                this.props.updateSearchingZipCodeProgress(true)
                this.props.client
                    .query({
                        query: GET_CATALOGS_QUERY,
                        fetchPolicy: 'no-cache',
                        variables: {
                            Id_Catalog: CITY_ID,
                            Id_Parent: Id_Parent || 0
                        }
                    }).then(({ data: { catalogitem } }) => {
                        this.setState(() => { return { cities: catalogitem, loadingCities: false, city: Id } }, () => {
                            this.props.updateSearchingZipCodeProgress(false)
                        })
                    }).catch(error => {
                        this.setState(() => { return { loadingCities: false } }, () => {
                            this.props.updateSearchingZipCodeProgress(false)
                        })
                    })
            })
    }

    loadCities = () => {
        this.setState({ loadingCities: true },
            () => {
                this.props.updateSearchingZipCodeProgress(true)
                this.props.client
                    .query({
                        query: GET_CATALOGS_QUERY,
                        fetchPolicy: 'no-cache',
                        variables: {
                            Id_Catalog: CITY_ID,
                            Id_Parent: this.state.state || 0
                        }
                    }).then(({ data: { catalogitem } }) => {
                        this.setState({ cities: catalogitem, loadingCities: false, findingZipCode: false },
                            () => {
                                this.props.updateSearchingZipCodeProgress(false)
                                var selectedCity = this.state.cities.find(item => item.Name.toLowerCase().trim().includes(this.state.cityName.toLowerCase().trim()))
                                if (selectedCity) {
                                    this.setState(() => { return { city: selectedCity.Id } }, () => { this.props.onChangeCity(selectedCity.Id) })
                                }
                            })
                    }).catch(error => {
                        this.setState({ loadingCities: false, findingZipCode: false }, () => {
                            this.props.updateSearchingZipCodeProgress(false)
                        })
                    })
            })

    }

    onValueChange = (e) => {
        this.setState({ [e.target.name]: e.target.type == 'checkbox' ? e.target.checked : e.target.value })

        if (e.target.name == 'city' && this.props.onChangeCity)
            this.props.onChangeCity(e.target.value)
        if (e.target.name == 'state' && this.props.onChangeState)
            this.props.onChangeState(e.target.value)
        if (e.target.name == 'zipCode' && this.props.onChageZipCode) {
            var value = e.target.value;
            this.props.updateSearchingZipCodeProgress(true);
            this.setState({ firstLoadStates: false, firstLoadCities: false }, () => {
                if (this.props.onChageZipCode)
                    this.props.onChageZipCode(value);
                if (this.props.onChangeCity)
                    this.props.onChangeCity(0);
                if (this.props.onChangeState)
                    this.props.onChangeState(0);
            })

        }

        if (e.target.name == "zipCode") {
            this.setState({ ...this.INITIAL_STATE });
        }
    }

    findZipCode = () => {
        //Get firts five characters of Zipcode input
        const zipCode = this.state.zipCode.trim().replace('-', '').substring(0, 5);
        this.setState({ findingZipCode: true }, () => {
            if (zipCode)
                this.setState({ loadingCities: true, loadingStates: true }, () => {
                    axios.get(`https://ziptasticapi.com/${zipCode}`)
                        .then(res => {
                            const cities = res.data;
                            if (!cities.error) {
                                this.setState({ stateCode: cities.state, cityName: cities.city.toLowerCase() },
                                    () => { this.loadStates(); })
                            } else
                                this.setState({ findingZipCode: false, loadingCities: false, loadingStates: false })
                        }).catch(error => { this.setState({ findingZipCode: false, loadingCities: false, loadingStates: false }) })
                })
            else
                this.setState({ findingZipCode: false })
        })

    }

    handleOnKeyUp = (e) => {
        if (e.keyCode == 9)
            this.findZipCode()
    }

    handleOnBlur = (e) => {
        this.findZipCode()
    }

    componentWillReceiveProps(nextProps) {
        //This is to load the datasource for States the first time that this component is loaded
        if (this.state.firstLoadStates && this.state.firstLoadCities &&
            this.props.state != nextProps.state && this.props.city != nextProps.city)
            this.loadFirstStates(nextProps.state, nextProps.city);

        this.setPropsToState(nextProps)
    }

    componentDidMount() {
        //This is to load the datasource for States the first time that this component is loaded
        if (this.state.firstLoadStates && this.state.firstLoadCities)
            this.loadFirstStates(this.props.state, this.props.city);

        this.setPropsToState(this.props)
    }

    setPropsToState = (props) => {
        //Setting Props to Component State only if Props has been passed through
        if (props.state != null)
            this.setState(() => { return { state: props.state } })
        if (props.city != null)
            this.setState(() => { return { city: props.city } })
        if (props.zipCode != null)
            this.setState(() => { return { zipCode: props.zipCode } })
        if (props.changeCity != null)
            this.setState(() => { return { changeCity: props.changeCity } })
    }

    render() {
        console.log("This is my render:::", this.state)
        const loading = this.state.loadingCities || this.state.loadingStates || this.state.findingZipCode;
        return <React.Fragment>
            <div className={this.props.cityColClass || "col-md-6 col-lg-4"}>
                <label className={`mr-1 ${this.props.cssTitle || ''}`}>{this.props.cityTitle || "* City"}</label>
                <span className="float-right">
                    <input type="checkbox" name="changeCity" onChange={this.onValueChange} disabled={this.props.disabledCheck || loading} checked={this.state.changeCity} />
                    <label className={`${this.props.cssTitle || ''}`} htmlFor="">Change selected city by zip code?</label>
                </span>
                <div className="select-animated">
                    <select name="city" className={this.props.cityClass || 'form-control'} onChange={this.onValueChange} value={this.state.city}
                        disabled={!this.state.changeCity || this.state.loadingCities || this.props.disabledCity} required={this.props.requiredCity}>
                        <option value="">Select a city</option>
                        {this.state.cities.map(({ Id, Name }) => (
                            <option key={Id} value={Id}>{Name}</option>
                        ))}
                    </select>
                    <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingCities || 'd-none'}`} />
                </div>
            </div>
            <div className={this.props.stateColClass || "col-md-6 col-lg-4"}>
                <div className="select-animated">
                    <label className={`${this.props.cssTitle || ''}`}>{this.props.stateTitle || "* State"}</label>
                    <select name="state" className={this.props.stateClass || 'form-control'} onChange={this.onValueChange} value={this.state.state}
                        disabled required={this.props.requiredState} >
                        <option value="">Select a state</option>
                        {this.state.states.map(({ Id, Name }) => (
                            <option key={Id} value={Id}>{Name}</option>
                        ))}
                    </select>
                    <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingStates || 'd-none'}`} />
                </div>
            </div>
            <div className={this.props.zipCodeColClass || "col-md-6 col-lg-4"}>
                <label className={`${this.props.cssTitle || ''}`}>{this.props.zipCodeTitle || "* Zip Code"}</label>
                <InputMask
                    id="zipCode"
                    name="zipCode"
                    mask={this.props.mask || DEFAULT_MASK}
                    maskChar=""
                    className={this.props.zipCodeClass || "form-control"}
                    onChange={this.onValueChange}
                    value={this.state.zipCode}
                    placeholder={this.props.placeholder || DEFAULT_PLACEHOLDER}
                    required={this.props.requiredZipCode}
                    minLength="15"
                    disabled={loading || this.props.disabledZipCode}
                    onKeyDown={this.handleOnKeyUp}
                    onBlur={this.handleOnBlur}

                />
            </div>
        </React.Fragment>
    }
}

export default withApollo(LocationForm);