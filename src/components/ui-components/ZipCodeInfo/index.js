import React, { Component, Fragment } from 'react';
import withApollo from 'react-apollo/withApollo';
import InputMask from 'react-input-mask';
import { GET_CITY_STATE_QUERY } from './Queries';

const DEFAULT_MASK = '99999', DEFAULT_PLACEHOLDER = '_____';

class ZipCodeInfo extends Component {
    state = {
        zipCode: '',
        stateId: 0,
        stateName: 'Enter a valid ZipCode',
        cityId: 0,
        cityName: '',
        loadingData: false,
        zipCodeOnChange: () => {}
    }
    
    handleZipCodeChange = ({currentTarget: {value}}) => {
        this.setState({ zipCode: value });
    };

    processZipCode = (zipCode) => {
        if(zipCode && zipCode.length > 4 && zipCode.length <= 6){
            this.findZipCodeInfo();
        }
        else {
            this.setState({
                zipCode,
                stateId: 0,
                stateName: 'Enter a valid ZipCode',
                cityId: 0,
                cityName: ''
            });
        }
    }

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
                    if (zipCodeStateCity) {
                        const foundData = {
                            cityId: zipCodeStateCity.countryId,
                            stateId: zipCodeStateCity.stateId,
                            stateName: zipCodeStateCity.stateRelation.Name.trim(),
                            cityName: zipCodeStateCity.cityRelation.Name.trim()
                        };

                        this.setState({ 
                            ...foundData,
                            loadingData: false
                        }, () => {
                            this.state.zipCodeOnChange({
                                zipCode,
                                ...foundData
                            });
                        });
                    }
                    else {
                        const notFoundData = {
                            cityId: 0,
                            stateId: 0,
                            stateName: 'Not Found',
                            cityName: ''
                        };

                        this.setState({ 
                            ...notFoundData,
                            loadingData: false
                        }, () => {
                            this.state.zipCodeOnChange({
                                zipCode,
                                ...notFoundData
                            });
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    this.setState({
                        loadingData: false,
                        stateName: 'Error to get information',
                        cityName: null
                    });
                })
        });
    }

    componentWillReceiveProps(nextProps){
        if(this.props.zipCode !== nextProps.zipCode)
            this.setState({ zipCode: nextProps.zipCode })
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.zipCode !== this.state.zipCode)
            this.processZipCode(this.state.zipCode);
    }

    componentDidMount(){
        const zipCodeOnChange = this.props.zipCodeOnChange ? this.props.zipCodeOnChange : () => {};
        this.setState({
            zipCode: this.props.zipCode,
            zipCodeOnChange
        });
    }

    render() {
        const {stateName, cityName} = this.state;
        console.log('Render ZipCodeInfo', this.props.zipCode); // TODO: (LF) QUITAR CONSOLE LOG
        return <Fragment>
            <div className="input-group ZipCodeInfo">
                <InputMask
                    id="zipCode"
                    name="zipCode"
                    mask={DEFAULT_MASK}
                    maskChar=""
                    className="form-control"
                    onChange={this.handleZipCodeChange}
                    value={this.state.zipCode}
                    placeholder={DEFAULT_PLACEHOLDER}
                    minLength="15"
                    disabled={this.state.loadingData || this.props.disabled}
                />
                <div class="input-group-append">
                    <span class="input-group-text" id="basic-addon2">
                        <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingData || 'd-none'}`} />
                        { 
                            this.state.loadingData 
                            ? <i className={`fa fa-spinner fa-spin select-animated-icon ${this.state.loadingCities || 'd-none'}`} />
                            : !stateName && !cityName ? 'Enter a ZipCode' : [stateName, cityName].join(', ') 
                        }
                    </span>
                </div>
            </div>
        </Fragment>
    }
}

export default withApollo(ZipCodeInfo);