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

import { GET_HOTEL_QUERY, GET_USERS, GET_EMPLOYEES_WITHOUT_ENTITY, GET_CONFIGREGIONS } from './queries';
import { INSERT_CATALOG_ITEM_QUERY, UPDATE_CATALOG_ITEM_QUERY, INSERT_CONFIG_REGIONS_QUERY, UPDATE_CONFIG_REGIONS_QUERY, UPDATE_RECRUITERS_BY_REGIONS_QUERY, UPDATE_HOTELS_BY_REGIONS_QUERY } from './mutations';

const OPERATION_MANAGER_ID = 3;
const REGIONAL_RECRUITER_ID = 4;
const REGIONAL_MANAGER_ID = 15;


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
    },
    overflowVisible:{
        overflow: 'visible'
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
            Old_recruitersTags: [],
            managerTags: [],
            Old_managerTags: [],
            directorTags: [],
            Old_directorTags: [],
            ConfigRegions: [],
            hotelsTags: [],
            Old_hotelsTags: [],
            result: [],
            IdRegionalManager: 0,
            IdRegionalDirector: 0,
            IdRecruiter: 0,
            code: '',
            name: '',
            id: 0,
            formValid: true,
            loading: false,
            openModal: false,
            saving: false,
            regionalManagerOpt: [],
            operationManagerOpt: [],
            regionalRecruiterOpt: [],
            HotelsOpt: []
        };

    }

    getUsers = () => {
        this.props.client
            .query({
                query: GET_USERS,
                fetchPolicy: 'no-cache',
                variables: {
                    Id_Roles: [REGIONAL_MANAGER_ID,REGIONAL_RECRUITER_ID,OPERATION_MANAGER_ID]
                }
            })
            .then(({ data }) => {
                let regManagers = [], opManagers = [], regRecruiters = [];
                
                regManagers = data.user.filter(u => u.Id_Roles === REGIONAL_MANAGER_ID)
                                        .map(u => { return { value: u.Id, label: u.Full_Name }});
                opManagers = data.user.filter(u => u.Id_Roles === OPERATION_MANAGER_ID)
                                        .map(u => { return { value: u.Id, label: u.Full_Name }});
                regRecruiters = data.user.filter(u => u.Id_Roles === REGIONAL_RECRUITER_ID)
                                        .map(u => { return { value: u.Id, label: u.Full_Name }});

                //Set values to state
                this.setState(() => ({
                    regionalManagerOpt: regManagers,
                    operationManagerOpt: opManagers,
                    regionalRecruiterOpt: regRecruiters
                }));

            })
            .catch(error => {
                console.log(error);
            });
    }

    getHotels = () => {
        this.props.client
            .query({
                query: GET_HOTEL_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                let options = [];
                
                options = data.getbusinesscompanies.map(h => { return { value: h.Id, label: h.Code + ' - ' + h.Name }});

                this.setState(() => ({
                    HotelsOpt: options
                }));

            })
            .catch(error => {
                console.log(error);
            });
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
                    this.getConfigRegions();
                    this.getRecruiter();
                    // this.getEmployeesWithoutEntity();
                    this.gethotelbyregion();
                    this.getrecruiterbyregion();
                }
            );
        } else if (!nextProps.openModal) {
            this.setState(
                {

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

        } else {

        }
        this.setState({
            openModal: nextProps.openModal,
            hotelsTags: [],
            Old_hotelsTags: [],
            recruitersTags: [],
            Old_recruitersTags: [],
            managerTags: [],
            Old_managerTags: [],
            directorTags: [],
            Old_directorTags: [],


        });

    }

    // get recruiters by regions
    getrecruiterbyregion = () => {
        this.props.client
            .query({
                query: GET_USERS,
                variables: {
                    Id_Roles: 4,
                    IdRegion: this.state.id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                let dataAPI = data.user;

                dataAPI.map(item => {
                    this.setState(prevState => ({
                        recruitersTags: [...prevState.recruitersTags, {
                            value: item.Id,
                            label: item.Full_Name
                        }],
                        Old_recruitersTags: [...prevState.recruitersTags, {
                            value: item.Id,
                            label: item.Full_Name
                        }],

                    }))
                }, () => {
                    this.setState({
                        loading: false
                    })
                });
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to show applicant information. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };

    // get hotel by region
    gethotelbyregion = () => {
        this.props.client
            .query({
                query: GET_HOTEL_QUERY,
                variables: {
                    Region: this.state.id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                let dataAPI = data.getbusinesscompanies;
                let object;

                dataAPI.map(item => {
                    this.setState(prevState => ({
                        hotelsTags: [...prevState.hotelsTags, {
                            value: item.Id,
                            label: item.Code + ' - ' + item.Name
                        }],
                        Old_hotelsTags: [...prevState.hotelsTags, {
                            value: item.Id,
                            label: item.Code + ' - ' + item.Name
                        }],
                    }))
                }, () => {
                    this.setState({
                        loading: false
                    })
                });
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to show applicant information. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };


    getRecruiter = () => {
        this.props.client
            .query({
                query: GET_USERS,
                variables: {
                    Id_Roles: 4
                },
            })
            .then(({ data }) => {
                this.setState({
                    recruiters: data.user
                });
            })
            .catch();
    };

    getConfigRegions = () => {
        this.props.client
            .query({
                query: GET_CONFIGREGIONS,
                variables: { regionId: this.state.id },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.configregions != null &&
                    data.configregions.length > 0) {
                    this.setState({
                        ConfigRegions: data.configregions,
                        IdRegionalManager: data.configregions[0].regionalManagerId,
                        IdRegionalDirector: data.configregions[0].regionalDirectorId,
                    });
                    this.getRegionalDirector(data.configregions[0].regionalDirectorId);
                    this.getRegionalManager(data.configregions[0].regionalManagerId);

                }


            })
            .catch();
    };


    getRegionalDirector = (idEmployee) => {
        this.props.client
            .query({
                query: GET_USERS,
                variables: { Id: idEmployee }
            })
            .then(({ data }) => {
                let dataAPI = data.user;
                dataAPI.map(item => {
                    this.setState(prevState => ({
                        directorTags: [...prevState.directorTags, {
                            value: item.Id,
                            label: item.Full_Name
                        }],
                        Old_directorTags: [...prevState.directorTags, {
                            value: item.Id,
                            label: item.Full_Name
                        }],

                    }))
                });
            })
            .catch();
    };

    getRegionalManager = (idEmployee) => {
        this.props.client
            .query({
                query: GET_USERS,
                variables: { Id: idEmployee }
            })
            .then(({ data }) => {
                let dataAPI = data.user;
                dataAPI.map(item => {
                    this.setState(prevState => ({
                        managerTags: [...prevState.managerTags, {
                            value: item.Id,
                            label: item.Full_Name
                        }],
                        Old_managerTags: [...prevState.managerTags, {
                            value: item.Id,
                            label: item.Full_Name
                        }],

                    }))
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
        let identificador = 0;
        const { isEdition, query, id } = this.getObjectToInsertAndUpdate();
        if (
            this.state.IdRegionalManager == 0 ||
            this.state.IdRegionalDirector == 0 ||
            this.state.code == '' ||
            this.state.name == ''
        ) {

            this.props.handleOpenSnackbar('warning', 'all fields are required');
        } else {
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

                            if (isEdition) {
                                identificador = id;
                            } else {
                                identificador = data.data.inscatalogitem.Id;
                            }

                            this.state.Old_hotelsTags.map((item) => {
                                this.addregionbusinescompanies(0, item.value)
                            });

                            this.state.hotelsTags.map((item) => {
                                this.addregionbusinescompanies(identificador, item.value)
                            });

                            this.state.Old_recruitersTags.map((itemrecruiter) => {
                                this.addregionusers(0, itemrecruiter.value)
                            });

                            this.state.recruitersTags.map((itemrecruiter) => {
                                this.addregionusers(identificador, itemrecruiter.value)
                            });

                            if (isEdition) {
                                this.addConfig(isEdition, id);
                            } else {
                                this.addConfig(isEdition, data.data.inscatalogitem.Id);
                            }


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
        }
    };

    addConfig = (isEdition, regionId) => {
        //let query = INSERT_CONFIG_REGIONS_QUERY;
        if (isEdition) {
            //query = UPDATE_CONFIG_REGIONS_QUERY;
            this.setState(
                {
                    loading: true
                },
                () => {
                    this.props.client
                        .mutate({
                            mutation: UPDATE_CONFIG_REGIONS_QUERY,
                            variables: {
                                regionId: regionId,
                                regionalManagerId: this.state.IdRegionalManager,
                                regionalDirectorId: this.state.IdRegionalDirector
                            }
                        })
                        .then((data) => {
                            if (data.data.updateConfigRegions == null) {
                                this.addConfig(false, regionId)
                            }

                            this.props.toggleRefresh();
                            this.props.handleCloseModal();
                            this.props.handleOpenSnackbar(
                                'success',
                                isEdition ? 'Catalog Item Updated!' : 'Catalog Item Inserted!'
                            );

                        })
                        .catch((error) => {
                            this.props.handleOpenSnackbar(
                                'error', 'Error: Inserting Catalog Item: ' + error
                            );
                            this.setState({
                                loading: false
                            });
                        });
                }
            );
        } else {
            this.setState(
                {
                    loading: true
                },
                () => {
                    this.props.client
                        .mutate({
                            mutation: INSERT_CONFIG_REGIONS_QUERY,
                            variables: {
                                configregions: {
                                    regionId: regionId,
                                    regionalManagerId: this.state.IdRegionalManager,
                                    regionalDirectorId: this.state.IdRegionalDirector
                                }
                            }
                        })
                        .then((data) => {
                            this.props.toggleRefresh();
                            this.props.handleCloseModal();
                            this.props.handleOpenSnackbar(
                                'success',
                                isEdition ? 'Catalog Item Updated!' : 'Catalog Item Inserted!'
                            );

                        })
                        .catch((error) => {
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

    }

    addregionbusinescompanies = (idRegion, idhotel) => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_HOTELS_BY_REGIONS_QUERY,
                        variables: {
                            Id: idhotel,
                            Region: idRegion
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });
    }

    addregionusers = (idRegion, idRecruiter) => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_RECRUITERS_BY_REGIONS_QUERY,
                        variables: {
                            Id: idRecruiter,
                            IdRegion: idRegion
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            });
    }

    handleChangePositionTag = (hotelsTags) => {
        this.setState({ hotelsTags });
    };

    handleChangerecruiterTag = (recruitersTags) => {
        this.setState({ recruitersTags });
    };

    handleChangeDirectorTag = (directorTags) => {
        this.setState({ directorTags });
        this.setState({ IdRegionalDirector: directorTags.value });
    };

    handleChangeManagerTag = (managerTags) => {
        this.setState({ managerTags });
        this.setState({ IdRegionalManager: managerTags.value });
    };

    componentWillMount() {
        this.getUsers();
        this.getHotels();
    }

    render() {
        let { classes } = this.props;
        return (
            <Dialog classes={{ paperScrollPaper: classes.overflowVisible }} maxWidth="md" open={this.state.openModal} onClose={this.props.handleCloseModal} disableBackdropClick={true}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Region's Configurations</h5>
                    </div>
                </DialogTitle>
                <DialogContent className={ classes.overflowVisible }>
                    <form action="">
                        <header className="RegionForm-header">
                            <div className="">
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
                                    <div className="col-md-4">
                                        <label htmlFor="">* Regional Manager</label>
                                        <div style={{
                                            paddingTop: '0px',
                                            paddingBottom: '2px',
                                        }}>
                                            <Select
                                                options={this.state.regionalManagerOpt}
                                                value={this.state.directorTags}
                                                onChange={this.handleChangeDirectorTag}
                                                closeMenuOnSelect={false}
                                                components={makeAnimated()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div className="">
                            <div className="">
                                <div className="">
                                    <div className="row">
                                       
                                            <div className="col-lg-12">
                                                <label htmlFor="">* Operation Manager</label>
                                                <div style={{
                                                    paddingTop: '0px',
                                                    paddingBottom: '2px',
                                                }}>
                                                    <Select
                                                        options={this.state.operationManagerOpt}
                                                        value={this.state.managerTags}
                                                        onChange={this.handleChangeManagerTag}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                    />
                                                </div>
                                            </div>
                                        
                                        
                                            <div className="col-lg-12">
                                                <label htmlFor="">Regional Recruiter</label>
                                                <div style={{
                                                    paddingTop: '0px',
                                                    paddingBottom: '2px',
                                                }}>
                                                    <Select
                                                        options={this.state.regionalRecruiterOpt}
                                                        value={this.state.recruitersTags}
                                                        onChange={this.handleChangerecruiterTag}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        isMulti
                                                    />
                                                </div>
                                            </div>

                                       
                                        
                                            <div className="col-lg-12">
                                                <label htmlFor="">Property Name</label>
                                                <div style={{
                                                    paddingTop: '0px',
                                                    paddingBottom: '2px',
                                                }}>
                                                    <Select
                                                        options={this.state.HotelsOpt}
                                                        value={this.state.hotelsTags}
                                                        onChange={this.handleChangePositionTag}
                                                        closeMenuOnSelect={false}
                                                        components={makeAnimated()}
                                                        isMulti
                                                    />
                                                </div>
                                            </div>
                                       
                                    </div>
                                </div>

                                <div className="bg-light tumi-buttonWrapper">
                                    <button
                                        type="button"
                                        className="btn btn-danger float-right tumi-button"
                                        onClick={this.props.handleCloseModal}
                                    >
                                        Cancel<i className="fas fa-ban ml-2" />
                                    </button>
                                    <button type="button" className="btn btn-success float-right tumi-button"
                                        onClick={() => {
                                            this.insertCatalogItem();
                                            //  this.addregionbusinescompanies();
                                        }}>
                                        Save {!this.state.loading && <i className="fas fa-save ml2" />}
                                        {this.state.loading && <i className="fas fa-spinner fa-spin  ml2" />}</button>
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