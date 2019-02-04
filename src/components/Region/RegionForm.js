import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import Query from 'react-apollo/Query';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { parse } from 'path';
import { bool } from 'prop-types';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import TimeField from 'react-simple-timefield';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import moment from 'moment';
import Datetime from 'react-datetime';

import { GET_HOTEL_QUERY, GET_RECRUITER, GET_EMPLOYEES_WITHOUT_ENTITY, GET_CONFIGREGIONS } from './queries';
import { INSERT_CATALOG_ITEM_QUERY, UPDATE_CATALOG_ITEM_QUERY, INSERT_CONFIG_REGIONS_QUERY, UPDATE_CONFIG_REGIONS_QUERY, UPDATE_REGION_BUSINESSCOMPANY_QUERY, UPDATE_REGION_USERS_QUERY } from './mutations';


const styles = (theme) => ({
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {},
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        },
        '&:hover': {
            cursor: 'pointer'
        }
    }

});

class RegionForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recruiters: [],
            employees: [],
            positionsTags: [],
            recruitersTags: [],
            ConfigRegions: [],
            hotelsTags: [],
            IdRegionalManager: 0,
            IdRegionalDirector: 0,
            IdRecruiter: 0,
            IdConfigRegion: 0,
            code: '',
            name: '',
            id: 0,
            formValid: true,
            loading: false,
            openModal: false,
            saving: false
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.item && nextProps.openModal) {
            this.setState(
                {
                    id: nextProps.item.Id,
                    code: nextProps.item.Name.trim(),
                    name: nextProps.item.DisplayLabel.trim(),
                    openModal: nextProps.item.openModal,
                },
                () => {
                    this.getRecruiter();
                    this.getEmployeesWithoutEntity();
                    this.getConfigRegions();
                }
            );
        } else if (!nextProps.openModal) {
            this.setState(
                {
                    recruiters: [],
                    employees: [],
                    IdRegionalManager: 0,
                    IdRegionalDirector: 0,
                    IdRecruiter: 0,
                    code: '',
                    name: '',
                    id: 0,
                    formValid: true,
                    loading: false,
                    openModal: false,
                    saving: false
                }
            );

        }

        this.getRecruiter();
        this.getEmployeesWithoutEntity();
        this.getConfigRegions();
        this.setState({
            openModal: nextProps.openModal
        });
    }

    getRecruiter = () => {
        this.props.client
            .query({
                query: GET_RECRUITER,
                variables: {}
            })
            .then(({ data }) => {
                this.setState({
                    recruiters: data.getusers

                });
            })
            .catch();
    };




    getConfigRegions = () => {
        this.props.client
            .query({
                query: GET_CONFIGREGIONS,
                variables: { regionId: this.state.id }
            })
            .then(({ data }) => {
                this.setState({
                    ConfigRegions: data.configregions,
                    IdConfigRegion: data.configregions[0].id,
                    IdRegionalManager: data.configregions[0].regionalManagerId,
                    IdRegionalDirector: data.configregions[0].regionalDirectorId,
                });
            })
            .catch();
    };



    getEmployeesWithoutEntity = () => {
        this.props.client
            .query({
                query: GET_EMPLOYEES_WITHOUT_ENTITY,
                variables: {}
            })
            .then(({ data }) => {
                this.setState({
                    employees: data.employees

                });
            })
            .catch();
    };

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    };

    handleValidate = (event) => {
        let selfHtml = event.currentTarget;
        if (selfHtml.value == "" || selfHtml.value == 0 || selfHtml.value == null)
            selfHtml.classList.add("is-invalid");
        else
            selfHtml.classList.remove("is-invalid");

    }

    getObjectToInsertAndUpdate = () => {
        let id = 0;
        let query = INSERT_CATALOG_ITEM_QUERY;
        const isEdition = this.state.id == 0 ? false : true;

        if (isEdition) {
            query = UPDATE_CATALOG_ITEM_QUERY;
        }

        return { isEdition: isEdition, query: query, id: this.state.id };
    };
    insertCatalogItem = () => {
        console.log("aqui estoy ", this.state.hotelsTags)
        const { isEdition, query, id } = this.getObjectToInsertAndUpdate();

        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: query,
                        variables: {
                            input: {
                                Id: id,
                                Id_Catalog: 4,
                                Id_Parent: 0,
                                Name: `'${this.state.code}'`,
                                DisplayLabel: `'${this.state.name}'`,
                                Description: `'${this.state.name}'`,
                                Value: `''`,
                                Value01: `''`,
                                Value02: `''`,
                                Value03: `''`,
                                Value04: `''`,
                                IsActive: 1,
                                User_Created: 1,
                                User_Updated: 1,
                                Date_Created: "'2018-08-14 16:10:25+00'",
                                Date_Updated: "'2018-08-14 16:10:25+00'"
                            }
                        }
                    })
                    .then((data) => {
                        console.log("Actualizo y estoy aqui ", data)

                        if (isEdition) { this.addConfig(isEdition, id); }
                        else { this.addConfig(isEdition, data.data.inscatalogitem.Id); }

                        this.props.toggleRefresh();
                        this.props.handleCloseModal();
                        this.props.handleOpenSnackbar(
                            'success',
                            isEdition ? 'Catalog Item Updated!' : 'Catalog Item Inserted!'
                        );
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            isEdition
                                ? 'Error: Updating Catalog Item: ' + error
                                : 'Error: Inserting Catalog Item: ' + error
                        );
                        this.setState({
                            loading: false
                        });
                    });
            }
        );
    };

    addConfig = (isEdition, regionId) => {
        console.log("aqui estoy addConfig ", isEdition, regionId)

        let query = INSERT_CONFIG_REGIONS_QUERY;

        if (isEdition) {
            query = UPDATE_CONFIG_REGIONS_QUERY;
        }

        console.log("aqui estoy query ", query)

        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: query,
                        variables: {
                            configregions: {
                                id: this.state.IdConfigRegion,
                                regionId: regionId,
                                regionalManagerId: this.state.IdRegionalManager,
                                regionalDirectorId: this.state.IdRegionalDirector
                            }
                        }
                    })
                    .then((data) => {
                        /*this.state.hotelsTags.forEach(function (element) {
                            console.log(element);
                        });*/
                    })
                    .catch((error) => {
                        console.log("INSERT_CONFIG_REGIONS_QUERY error ", error)
                        this.props.handleOpenSnackbar(
                            'error', 'Error: Inserting Catalog Item: ' + error
                        );
                        this.setState({
                            loading: false
                        });
                    });
            }
        );
    }

    /* updRegionBusinessCompany = (regionId, IdBusiness) => {
         this.setState(
             {
                 loading: true
             },
             () => {
                 this.props.client
                     .mutate({
                         mutation: UPDATE_REGION_BUSINESSCOMPANY_QUERY,
                         variables: {
                             args: {
                                 Region: regionId,
                                 Id: IdBusiness
                             }
                         }
                     })
                     .then((data) => {
                         console.log("INSERT_CONFIG_REGIONS_QUERY ", data)
                     })
                     .catch((error) => {
                         console.log("INSERT_CONFIG_REGIONS_QUERY error ", error)
                         this.props.handleOpenSnackbar(
                             'error', 'Error: Inserting Catalog Item: ' + error
                         );
                         this.setState({
                             loading: false
                         });
                     });
             }
         );
     }*/

    handleChangePositionTag = (hotelsTags) => {
        this.setState({ hotelsTags });
    };

    handleChangerecruiterTag = (recruitersTags) => {
        this.setState({ recruitersTags });
    };

    render() {
        return (
            <Dialog maxWidth="md" open={this.state.openModal} onClose={this.props.handleCloseModal}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Region's Configurations</h5>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form action="">
                        <header className="RegionForm-header">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label htmlFor="">* Region's Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            onChange={this.handleChange}
                                            value={this.state.name}
                                            maxLength="80"
                                            onBlur={this.handleValidate}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="">* Region's Code</label>
                                        <input
                                            required
                                            type="text"
                                            className="form-control"
                                            id="code"
                                            name="code"
                                            onChange={this.handleChange}
                                            value={this.state.code}
                                            maxLength="10"
                                            onBlur={this.handleValidate}
                                        />
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div className="container-fluid">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <label htmlFor="">Regional Manager</label>
                                            <select
                                                required
                                                name="IdRegionalManager"
                                                className="form-control"
                                                id=""
                                                onChange={this.handleChange}
                                                value={this.state.IdRegionalManager}
                                            >
                                                <option value={0}>Select a Regional Manager</option>
                                                {this.state.employees.map((recruiter) => (
                                                    <option value={recruiter.id}>{recruiter.firstName} {recruiter.lastName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="">Regional Director</label>
                                            <select
                                                required
                                                name="IdRegionalDirector"
                                                className="form-control"
                                                id=""
                                                onChange={this.handleChange}
                                                value={this.state.IdRegionalDirector}
                                            >
                                                <option value={0}>Select a Regional Director</option>
                                                {this.state.employees.map((recruiter) => (
                                                    <option value={recruiter.id}>{recruiter.firstName} - {recruiter.lastName}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label htmlFor="">Regional Recruiter</label>
                                            <Query query={GET_RECRUITER}>
                                                {({ loading, error, data, refetch, networkStatus }) => {
                                                    //if (networkStatus === 4) return <LinearProgress />;
                                                    if (error) return <p>Error </p>;
                                                    if (data.getusers != null && data.getusers.length > 0) {
                                                        let options = [];
                                                        data.getusers.map((item) => (
                                                            options.push({ value: item.Id, label: item.Full_Name })
                                                        ));

                                                        return (
                                                            <div style={{
                                                                paddingTop: '0px',
                                                                paddingBottom: '2px',
                                                            }}>
                                                                <Select
                                                                    options={options}
                                                                    value={this.state.recruitersTags}
                                                                    onChange={this.handleChangerecruiterTag}
                                                                    closeMenuOnSelect={false}
                                                                    components={makeAnimated()}
                                                                    isMulti
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                    return <SelectNothingToDisplay />;
                                                }}
                                            </Query>
                                        </div>

                                        <div className="col-md-4">
                                            <label htmlFor="">Property Name</label>
                                            <Query query={GET_HOTEL_QUERY}>
                                                {({ loading, error, data, refetch, networkStatus }) => {
                                                    //if (networkStatus === 4) return <LinearProgress />;
                                                    if (error) return <p>Error </p>;
                                                    if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {
                                                        let options = [];
                                                        data.getbusinesscompanies.map((item) => (
                                                            options.push({ value: item.Id, label: item.Code + ' - ' + item.Name })
                                                        ));

                                                        return (
                                                            <div style={{
                                                                paddingTop: '0px',
                                                                paddingBottom: '2px',
                                                            }}>
                                                                <Select
                                                                    options={options}
                                                                    value={this.state.hotelsTags}
                                                                    onChange={this.handleChangePositionTag}
                                                                    closeMenuOnSelect={false}
                                                                    components={makeAnimated()}
                                                                    isMulti
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                    return <SelectNothingToDisplay />;
                                                }}
                                            </Query>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="row">
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <button
                                        type="button"
                                        className="btn btn-danger ml-1 float-right"
                                        onClick={this.props.handleCloseModal}
                                    >
                                        Cancel<i className="fas fa-ban ml-2" />
                                    </button>
                                    <button type="button" className="btn btn-success float-right mr-1"
                                        onClick={() => { this.insertCatalogItem(); }}>
                                        Save {!this.state.saving && <i className="fas fa-save ml2" />}
                                        {this.state.saving && <i className="fas fa-spinner fa-spin  ml2" />}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent >
            </Dialog >
        );
    }

}

RegionForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(RegionForm));