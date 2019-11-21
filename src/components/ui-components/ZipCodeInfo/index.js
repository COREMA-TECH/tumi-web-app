import React, { Component, Fragment } from 'react';
import withApollo from 'react-apollo/withApollo';
import InputMask from 'react-input-mask';
import { GET_CITY_STATE_QUERY } from './Queries';

const STATE_ID = 3, CITY_ID = 5,
    DEFAULT_MASK = '99999', DEFAULT_PLACEHOLDER = '_____',
    DEFAULT_STATE_CODE = 'XYZ';

class ZipCodeInfo extends Component {
    state = {
        loadingData: false,
        zipCode: null,
        cityId: 0,
        stateId: 0,
        cityName: null,
        stateName: null
    }
    
    handleZipCodeChange = ({currentTarget: {value}}) => {
        this.setState({zipCode: value}, () => {
            if(value && value.length > 4 && value.length <= 6) this.findZipCodeInfo();
        });
    };

    findZipCodeInfo = () => {
        const zipCode = this.state.zipCode.trim().replace('-', '').substring(0, 5);
        this.setState({loadingData: true}, () => {
            this.props.client
                .query({
                    query: GET_CITY_STATE_QUERY,
                    fetchPolicy: 'no-cache',
                    variables: {
                        Zipcode: zipCode
                    }
                }).then(({ data: { zipCodeStateCity } }) => {
                    this.setState({ loadingData: false },
                        () => {
                            if (zipCodeStateCity)
                                this.setState({ 
                                    cityId: zipCodeStateCity.countryId,
                                    stateId: zipCodeStateCity.stateId,
                                    stateName: zipCodeStateCity.stateRelation.Name.trim(),
                                    cityName: zipCodeStateCity.cityRelation.Name.trim() 
                                });
                        })
                }).catch(error => {
                    this.setState({
                        loadingData: false,
                        stateName: 'Not Found',
                        cityName: null
                    });
                })
        });
    }

    render() {
        const {stateName, cityName} = this.state;
        return <Fragment>
            <div className="input-group ZipCodeInfo">
                <InputMask
                    id="zipCode"
                    name="zipCode"
                    mask={DEFAULT_MASK}
                    maskChar=""
                    className="form-control"
                    onChange={this.handleZipCodeChange}
                    value={this.props.value}
                    placeholder={DEFAULT_PLACEHOLDER}
                    //required={this.props.requiredZipCode}
                    minLength="15"
                    disabled={this.state.loadingData}
                    //onKeyDown={this.handleOnKeyUp}
                    //onBlur={this.handleOnBlur}

                />
                <div class="input-group-append">
                    <span class="input-group-text" id="basic-addon2">
                        <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingData || 'd-none'}`} />
                        { 
                            this.state.loadingData 
                            ? <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingCities || 'd-none'}`} />
                            : !stateName && !cityName ? 'Enter a ZipCode' : [stateName, cityName].join() 
                        }
                    </span>
                </div>
            </div>
        </Fragment>
    }
}

export default withApollo(ZipCodeInfo);