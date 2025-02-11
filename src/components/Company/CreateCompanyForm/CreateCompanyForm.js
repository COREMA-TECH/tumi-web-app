import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Select from "../../material-ui/Select";
import './index.css';
import DatePicker from "../../material-ui/DatePicker";
import Switch from "../../material-ui/Switch";

const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px',
        padding: '20px'
    },
    formControl: {
        margin: theme.spacing.unit,
        width: '30%',
    },
    formControlFour: {
        margin: theme.spacing.unit,
        width: '23%',
    },
    formControlInline: {},
    addressControl: {
        width: '47%'
    },
    formSelect: {
        margin: theme.spacing.unit,
        width: '23%'
    },
    divStyle: {
        width: '80%',
        marginTop: '10px'
    },
    title: {
        display: 'inline'
    }
});

class ComposedTextField extends React.Component {
    state = {
        completedInput: false,
        loaded: false,
        name: '',
        legalName: '',
        description: '',
        location: '',
        address: '',
        optionalAddress: '',
        businessType: '',
        country: 6,
        state: 0,
        region: '',
        city: '',
        management: '',
        phoneNumber: '',
        startDate: '',
        startWeek: '',
        endWeek: '',
        workWeek: '',
        avatar: 'url',
        otherPhoneNumber: '',
        room: '',
        rate: '',
        fax: '',
        zipCode: '',
        phonePrefix: '505',
        email: '',
        code: '',
        code01: '',
        active: 0
    };

    getCompany = gql`
        {
            getcompanies(Id: null, IsActive: 1) {
                Id
                Name
            }
        }
    `;


    getCountriesQuery = gql`
        {
            getcatalogitem( IsActive: 1, Id_Parent: null, Id_Catalog: 2) {
                Id
                Name
                IsActive
            }
        }
    `;

    getStatesQuery = gql`
        query States($parent: Int!)
        {
            getcatalogitem(IsActive: 1, Id_Parent: 6, Id_Catalog: 3) {
                Id
                Name
                IsActive
            }
        }
    `;


    getCitiesQuery = gql`
        query Cities($parent: Int!)
        {
            getcatalogitem(IsActive: 1, Id_Parent: 140, Id_Catalog: 5) {
                Id
                Name
                IsActive
            }
        }
    `;

    //Query to get data of a specific company using the id received by props
    getCompanyQuery = gql`
        query getCompany($id: Int!)
        {
            getcompanies(Id: $id, IsActive: 1) {
                Id
                Code
                Code01
                Id_Company
                BusinessType
                Name
                Description
                Start_Week
                End_Week
                Start_Date
                Legal_Name
                Country
                State
                Zipcode,
                Fax
                City
                Id_Parent
                IsActive
                User_Created
                User_Updated
                Date_Created
                Date_Updated
                ImageURL,
                Rate,
                Location,
                Location01,
                Primary_Email,
                Phone_Number
            }
        }
    `;

    updateStateCountry = (id) => {
        this.setState({
            country: id
        })
    };

    updateStateActive = (active) => {
        if (active) {
            this.setState({
                active: 1
            });
        } else {
            this.setState({
                active: 0
            });
        }

    };


    updateStateState = (id) => {
        this.setState({
            state: id
        })
    };

    updateStateCity = (id) => {
        this.setState({
            city: id
        })
    };

    updateStateStartDate = (value) => {
        this.setState({
            startDate: value
        })
    };


    validateAllState() {
        return (
            this.state.name === '' ||
            this.state.legalName === '' ||
            this.state.description === '' ||
            this.state.startWeek === '' ||
            this.state.endWeek === '' ||
            this.state.address === '' ||
            this.state.optionalAddress === '' ||
            this.state.rate === '' ||
            this.state.email === '' ||
            this.state.phoneNumber === '' ||
            this.state.code === '' ||
            this.state.code01 === '' ||
            this.state.fax === '' ||
            this.state.startDate === '' ||
            this.state.avatar === '' ||
            this.state.otherPhoneNumber === '' ||
            this.state.room === '');
    }

    render() {
        const { classes } = this.props;
        const ADD_TODO = gql`
            mutation insertCompanies($input: iParamBC!) {
                inscompanies(input: $input) {
                    Id
                    Name
                    Description
                }
            }
        `;


        const UPDATE_COMPANIES = gql`
            mutation updateCompanies($input: iParamBC!) {
                updcompanies(input: $input) {
                    Id
                    Name
                    Description
                }
            }
        `;


        if (this.state.loaded === false) {
            return (
                <Query query={this.getCompanyQuery} variables={{ id: this.props.idCompany }}>
                    {({ loading, error, data, refetch, }) => {
                        if (loading) return <LinearProgress />;
                        if (error) return <p>Error </p>;
                        if (data.getcompanies != null && data.getcompanies.length > 0) {
                            data.getcompanies.map(item => {
                                this.setState({
                                    loaded: true,
                                    name: item.Name.trim(),
                                    legalName: item.Legal_Name.trim(),
                                    description: item.Description.trim(),
                                    startWeek: item.Start_Week,
                                    endWeek: item.End_Week,
                                    address: item.Location.trim(),
                                    optionalAddress: item.Location01.trim(),


                                    country: item.Country,
                                    state: item.State,
                                    city: item.City,

                                    rate: item.Rate,
                                    email: item.Primary_Email.trim(),
                                    phoneNumber: item.Phone_Number.trim(),

                                    code: item.Code.trim(),
                                    code01: item.Code01.trim(),
                                    zipCode: item.Zipcode,
                                    fax: item.Fax,
                                    startDate: item.Start_Date.trim(),
                                    active: item.IsActive
                                })
                            });
                            return true;
                        }
                        return <p>Nothing to display </p>;
                    }}
                </Query>
            )
        } else {
            return (
                <div className={classes.container}>

                    {/*<div className={classes.divStyle}>*/}

                    {/*<Mutation mutation={ADD_TODO}>*/}
                    {/*{(inscompanies, {loading, error}) => (*/}
                    {/*<Button*/}
                    {/*variant="contained"*/}
                    {/*color="primary"*/}
                    {/*disabled={this.validateAllState()}*/}
                    {/*className={classes.button}*/}
                    {/*onClick={() => {*/}

                    {/*inscompanies({*/}
                    {/*variables: {*/}
                    {/*input: {*/}
                    {/*Id: 150,*/}
                    {/*Code: `'${this.state.Code}'`,*/}
                    {/*Code01: `'${this.state.Code01}'`,*/}
                    {/*Id_Company: 1,*/}
                    {/*BusinessType: 1,*/}
                    {/*Location: `'${this.state.address}'`,*/}
                    {/*Location01: `'${this.state.optionalAddress}'`,*/}
                    {/*Name: `'${this.state.name}'`,*/}
                    {/*Description: `'${this.state.description}'`,*/}
                    {/*Start_Week: this.state.startWeek,*/}
                    {/*End_Week: this.state.endWeek,*/}
                    {/*Legal_Name: `'${this.state.legalName}'`,*/}
                    {/*Country: parseInt(this.state.country),*/}
                    {/*State: parseInt(this.state.state),*/}
                    {/*Rate: parseFloat(this.state.rate),*/}
                    {/*Zipcode: parseInt(this.state.zipCode),*/}
                    {/*Fax: `'${this.state.fax}'`,*/}
                    {/*Primary_Email: `'${this.state.position}'`,*/}
                    {/*Phone_Number: `'${this.state.phoneNumber}'`,*/}
                    {/*Phone_Prefix: `'${this.state.phonePrefix}'`,*/}
                    {/*City: parseInt(this.state.city),*/}
                    {/*Id_Parent: 1,*/}
                    {/*IsActive: parseInt(this.state.active),*/}
                    {/*User_Created: 1,*/}
                    {/*User_Updated: 1,*/}
                    {/*Date_Created: "'2018-08-14 16:10:25+00'",*/}
                    {/*Date_Updated: "'2018-08-14 16:10:25+00'",*/}
                    {/*ImageURL: `'${this.state.avatar}'`,*/}
                    {/*Start_Date: `'${this.state.startDate}'`*/}
                    {/*}*/}
                    {/*}*/}
                    {/*}*/}
                    {/*);*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*Add Company*/}
                    {/*</Button>*/}

                    {/*)}*/}

                    {/*</div>*/}
                    <div className="card-form-company">
                        <div className="card-form-header">General Information</div>
                        <div className="card-form-body">
                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Company Name</InputLabel>
                                <Input
                                    id="name-simple"
                                    value={this.state.name}
                                    onChange={(text) => this.setState({ name: text.target.value })}
                                />
                            </FormControl>
                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Legal Name</InputLabel>
                                <Input
                                    id="name-simple"
                                    value={this.state.legalName}
                                    onChange={(text) => this.setState({ legalName: text.target.value })}
                                />
                            </FormControl>
                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Description</InputLabel>
                                <Input
                                    id="name-simple"
                                    value={this.state.description}
                                    onChange={(text) => this.setState({ description: text.target.value })}
                                />
                            </FormControl>

                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Address No. 1</InputLabel>
                                <Input
                                    required={true}
                                    id="name-simple"
                                    value={this.state.address}
                                    onChange={(text) => this.setState({ address: text.target.value })}
                                />
                            </FormControl>
                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Address No. 2</InputLabel>
                                <Input
                                    required={true}
                                    id="name-simple"
                                    value={this.state.optionalAddress}
                                    onChange={(text) => this.setState({ optionalAddress: text.target.value })}
                                />
                            </FormControl>

                            <FormControl className="input">
                                <Query query={this.getCountriesQuery}>
                                    {({ loading, error, data, refetch, networkStatus }) => {
                                        //if (networkStatus === 4) return <LinearProgress />;
                                        if (loading) return <LinearProgress />;
                                        if (error) return <p> </p>;
                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                            return (<Select label={"Country"} values={data.getcatalogitem}
                                                value={this.state.country}
                                                update={this.updateStateCountry} />)
                                        }
                                        return <p>Nothing to display </p>;
                                    }}
                                </Query>
                            </FormControl>
                            <FormControl className="input">
                                <Query query={this.getStatesQuery} variables={{ parent: this.state.country }}>
                                    {({ loading, error, data, refetch, networkStatus }) => {
                                        //if (networkStatus === 4) return <LinearProgress />;
                                        if (loading) return <LinearProgress />;
                                        if (error) return <p> </p>;
                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                            return <Select label={"States"} update={this.updateStateState}
                                                value={this.state.state}
                                                values={data.getcatalogitem} />
                                        }

                                        return <p>Nothing to display </p>;
                                    }}
                                </Query>
                            </FormControl>

                            <FormControl className="input">
                                <Query query={this.getCitiesQuery} variables={{ parent: this.state.state }}>
                                    {({ loading, error, data, refetch, networkStatus }) => {
                                        //if (networkStatus === 4) return <LinearProgress />;
                                        if (loading) return <LinearProgress />;
                                        if (error) return <p> </p>;
                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                            return <Select label={"Cities"} update={this.updateStateCity}
                                                value={this.state.city}
                                                values={data.getcatalogitem} />
                                        }
                                        return <p>Nothing to display </p>;
                                    }}
                                </Query>
                            </FormControl>

                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Zip Code</InputLabel>
                                <Input
                                    required={true}
                                    id="name-simple"
                                    value={this.state.zipCode}
                                    onChange={(text) => this.setState({ zipCode: text.target.value })}
                                />
                            </FormControl>

                            <div className="container-row">
                                <FormControl className="input">
                                    <InputLabel htmlFor="name-simple">Phone Number</InputLabel>
                                    <Input
                                        required={true}
                                        id="name-simple"
                                        value={this.state.phoneNumber}
                                        onChange={(text) => this.setState({ phoneNumber: text.target.value })}
                                    />
                                </FormControl>

                                <FormControl className="input">
                                    <InputLabel htmlFor="name-simple">Fax Number</InputLabel>
                                    <Input
                                        required={true}
                                        id="name-simple"
                                        value={this.state.fax}
                                        onChange={(text) => this.setState({ fax: text.target.value })}
                                    />
                                </FormControl>
                            </div>

                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Email</InputLabel>
                                <Input
                                    required={true}
                                    id="name-simple"
                                    value={this.state.email}
                                    onChange={(text) => this.setState({ email: text.target.value })}
                                />
                            </FormControl>

                            {/*
                                    TUMI CODE COMPONENTS
                            */}
                            {/*<FormControl className="input">*/}
                            {/*<InputLabel htmlFor="name-simple">Tumi Code</InputLabel>*/}
                            {/*<Input*/}
                            {/*required={true}*/}
                            {/*id="name-simple"*/}
                            {/*value={this.state.code}*/}
                            {/*onChange={(text) => this.setState({code: text.target.value})}*/}
                            {/*/>*/}
                            {/*</FormControl>*/}
                            {/*<FormControl className="input">*/}
                            {/*<InputLabel htmlFor="name-simple">Hotel Code</InputLabel>*/}
                            {/*<Input*/}
                            {/*required={true}*/}
                            {/*id="name-simple"*/}
                            {/*value={this.state.code01}*/}
                            {/*onChange={(text) => this.setState({code01: text.target.value})}*/}
                            {/*/>*/}
                            {/*</FormControl>*/}
                        </div>
                    </div>


                    <div className="card-form-company">
                        <div className="card-form-header">Legal Docs</div>
                        <div className="card-form-body">
                            <FormControl className="input">
                                <DatePicker
                                    update={this.updateStateStartDate}
                                />
                            </FormControl>

                            <div className="container-row">
                                <FormControl className="input">
                                    <InputLabel htmlFor="name-simple">Start Week</InputLabel>
                                    <Input
                                        required={true}
                                        id="name-simple"
                                        value={this.state.startWeek}
                                        onChange={(text) => this.setState({ startWeek: text.target.value })}
                                    />
                                </FormControl>
                                <FormControl className="input">
                                    <InputLabel htmlFor="name-simple">End Week</InputLabel>
                                    <Input
                                        required={true}
                                        id="name-simple"
                                        value={this.state.endWeek}
                                        onChange={(text) => this.setState({ endWeek: text.target.value })}
                                    />
                                </FormControl>
                            </div>

                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Rate</InputLabel>
                                <Input
                                    required={true}
                                    id="name-simple"
                                    type="number"
                                    value={this.state.rate}
                                    onChange={(text) => this.setState({ rate: text.target.value })}
                                />
                            </FormControl>

                            <div className="container-row">
                                <span className="is-active">
                                    <span>Active:</span>
                                    <Switch
                                        value={this.state.active}
                                        update={this.updateStateActive}
                                    />
                                </span>
                            </div>
                            {/*<FormControl className="input">*/}
                            {/*<InputLabel htmlFor="name-simple">Phone Number</InputLabel>*/}
                            {/*<Input*/}
                            {/*required={true}*/}
                            {/*id="name-simple"*/}
                            {/*value={this.state.otherPhoneNumber}*/}
                            {/*onChange={(text) => this.setState({*/}
                            {/*otherPhoneNumber: text.target.value*/}
                            {/*})}*/}
                            {/*/>*/}
                            {/*</FormControl>*/}


                            <div className="container-row">
                                <span className="subtitle-card">Documents</span>
                            </div>

                            <FormControl className="input">
                                <InputLabel htmlFor="name-simple">Documents</InputLabel>
                                <Input
                                    required={true}
                                    id="name-simple"
                                    value={this.state.room}
                                    type="file"
                                    onChange={(text) => this.setState({
                                        room: text.target.value
                                    })}
                                />
                            </FormControl>

                        </div>
                    </div>


                    <div className="card-form-company">
                        <div className="card-form-header">Properties</div>
                        <div className="card-form-body">

                        </div>
                        <div className="card-form-footer">
                            <span className="add-property"><span>+</span>  Add New Property</span>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

ComposedTextField.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ComposedTextField);
