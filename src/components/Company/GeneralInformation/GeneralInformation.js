import React, {Component} from 'react';
import './index.css';
import InputForm from "../../ui-components/InputForm/InputForm";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import TabsInDialog from "../TabsInDialog/TabsInDialog";
import InputFile from "../../ui-components/InputFile/InputFile";
import {gql} from "apollo-boost";
import SelectForm from "../../ui-components/SelectForm/SelectForm";
import Query from "react-apollo/Query";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import days from '../../../data/days.json';

class GeneralInformation extends Component {
    state = {
        open: false,
        scroll: 'paper',
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
    }

    /**
     *  QUERIES to get the countries, cities and states
     */
    getCountriesQuery = gql`
        {
            getcatalogitem(Id: null, IsActive: 1, Id_Parent: null, Id_Catalog: 2) {
                Id
                Name
                IsActive
            }
        }
    `;

    getStatesQuery = gql`
        query States($parent: Int!)
        {
            getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
                Id
                Name
                IsActive
            }
        }
    `;


    getCitiesQuery = gql`
        query Cities($parent: Int!)
        {
            getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
                Id
                Name
                IsActive
            }
        }
    `;
    /**
     *  End of the countries, cities and states queries
     */


    /*****************************************************************
     *             QUERY to get the company information              *
     ****************************************************************/
    getCompanyQuery = gql`
        query getCompany($id: Int!)
        {
            getbusinesscompanies(Id: $id, IsActive: 1) {
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

    /**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION *
     **********************************************************/



    /**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/


    /**
     * Events of the component
     */
    handleClickOpen = scroll => () => {
        this.setState({open: true, scroll});
    };

    handleClose = () => {
        this.setState({open: false});
    };
    /**
     * End of the events
     */


    /**
     * Return the component
     *
     * @returns {XML} component
     */
    render() {

        /**
         * If the data is not loaded, make the Query to get company information by id
         */
        if (this.state.loaded === false && this.props.idCompany !== 0) {
            return (
                <Query query={this.getCompanyQuery} variables={{id: this.props.idCompany}}>
                    {({loading, error, data, refetch,}) => {
                        if (loading) return <LinearProgress/>;
                        if (error) return <p>Error </p>;
                        if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {
                            data.getbusinesscompanies.map(item => {
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
        }

        /**
         * If the data is ready render the component
         */
        return (
            <div className="general-information-tab">
                <div className="general-information__header">
                    <div className="input-container">
                        <span className="input-label">Markup</span>
                        <InputForm/>
                    </div>
                    <div className="input-container">
                        <span className="input-label">Company Code</span>
                        <InputForm/>
                    </div>
                </div>
                <div className="general-information__content">
                    <div className="card-form-company">
                        <div className="card-form-header grey">General Information</div>
                        <div className="card-form-body">
                            <div className="card-form-row">
                                <span className="input-label primary">Company Name</span>
                                <InputForm value={this.state.name}/>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">Address</span>
                                <InputForm value={this.state.address}/>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">Address 2</span>
                                <InputForm value={this.state.optionalAddress}/>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">Suite</span>
                                <InputForm value={this.state.rate}/>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">Countries</span>
                                <Query query={this.getCountriesQuery}>
                                    {({loading, error, data, refetch, networkStatus}) => {
                                        //if (networkStatus === 4) return <LinearProgress />;
                                        if (loading) return <LinearProgress/>;
                                        if (error) return <p>Error </p>;
                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                            console.log("Data of cities" + data.getcatalogitem);
                                            return <SelectForm data={data.getcatalogitem}/>
                                        }
                                        return <p>Nothing to display </p>;
                                    }}
                                </Query>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">State</span>
                                <Query query={this.getStatesQuery} variables={{parent: 6}}>
                                    {({loading, error, data, refetch, networkStatus}) => {
                                        //if (networkStatus === 4) return <LinearProgress />;
                                        if (loading) return <LinearProgress/>;
                                        if (error) return <p>Error </p>;
                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                            console.log("VALUE: " + data.getcatalogitem);
                                            return (
                                                <SelectForm data={data.getcatalogitem}/>
                                            )
                                        }
                                        return <p>Nothing to display </p>;
                                    }}
                                </Query>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">City</span>
                                <Query query={this.getCitiesQuery} variables={{parent: 140}}>
                                    {({loading, error, data, refetch, networkStatus}) => {
                                        //if (networkStatus === 4) return <LinearProgress />;
                                        if (loading) return <LinearProgress/>;
                                        if (error) return <p>Error </p>;
                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                            console.log("Data of cities" + data.getcatalogitem);
                                            return <SelectForm data={data.getcatalogitem}/>
                                        }
                                        return <p>Nothing to display </p>;
                                    }}
                                </Query>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">Zip Code</span>
                                <InputForm value={this.state.zipCode}/>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">Phone Number</span>
                                <InputForm value={this.state.phoneNumber}/>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">Fax Week</span>
                                <InputForm value={this.state.fax}/>
                            </div>

                        </div>
                    </div>
                    <div className="card-form-company">
                        <div className="card-form-header yellow">Legal Docs</div>
                        <div className="card-form-body">
                            <div className="card-form-row">
                                <span className="input-label primary">Contract Start Date</span>
                                <InputForm value={this.state.startDate}/>
                            </div>
                            <div className="card-form-row">
                                <span className="input-label primary">Week Start</span>
                                <SelectForm data={days}/>
                            </div>

                            <div className="card-form-row">
                                <span className="input-label  primary">Week End</span>
                                <SelectForm data={days}/>
                            </div>

                            <div className="divider-text">Documents</div>
                            <div className="card-form-row card-form-row--center">
                                <span className="primary">Contract</span>
                                <InputFile/>
                            </div>
                            <div className="card-form-row card-form-row--center">
                                <span className="primary">Insurance</span>
                                <InputFile/>
                            </div>
                            <div className="card-form-row card-form-row--center">
                                <span className="primary">Other 1</span>
                                <InputFile/>
                            </div>
                            <div className="card-form-row card-form-row--center">
                                <span className="primary">Other 2</span>
                                <InputFile/>
                            </div>

                        </div>
                    </div>
                    <div className="card-form-company">
                        <div className="card-form-header orange">Properties</div>
                        <div className="card-form-body"></div>
                        <div className="card-form-footer">
                            <span className="add-property" onClick={this.handleClickOpen('paper')}>+ Add Property</span>
                        </div>
                    </div>
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    scroll={this.state.scroll}
                    aria-labelledby="scroll-dialog-title"
                >
                    <div className="dialog">
                        <div className="dialog-header">Property
                            Information
                        </div>
                        <div className="dialog-body">
                            <div>
                                <TabsInDialog/>
                            </div>
                        </div>
                        <DialogActions className="dialog-footer">
                            <div className="contract-footer">
                                <div className="contract-next-button">Save</div>
                            </div>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        );
    }
}

GeneralInformation.propTypes = {};

export default GeneralInformation;
