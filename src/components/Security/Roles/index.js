import React, { Component, Fragment } from 'react';
import RolesModal from './RolesModal';
import RolesTable from './RolesTable';
import withGlobalContent from 'Generic/Global';
import {withApollo} from 'react-apollo';
import {GET_ROLES_QUERY, GET_REGIONS_ROLES_QUERY, GET_COMPANY_QUERY, GET_FORMS_QUERY, GET_REGIONS_QUERY} from './Queries';
import {INSERT_ROLES, UPDATE_ROLES, DELETE_ROLES} from './Mutations';
import AlertDialogSlide from 'Generic/AlertDialogSlide';

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            regionsOpt: [],
            dataForms: [],
            forms: [],
            company: [],
            companiesOpt: [],
            loading: false,
            openRolesModal: false,

            idToDelete: 0,
            loadingConfirm: false,
            openDeleteConfirm: false,

            rolToEdit: null,
            regionsRoles: []
        };
    }

    handleCloseRolesModal = () => {
        this.setState({
            openRolesModal: false,
            rolToEdit: null
        });
    }

    loadRoles = () => {
        this.props.client
            .query({
                query: GET_ROLES_QUERY,
                variables: {},
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getroles != null) {
                    this.setState(
                        {
                            data: data.data.getroles,
                            dataForms: data.data.getforms
                        },
                        () => {
                            this.getRegionsRoles();
                        }
                    );
                } else {
                    this.props.handleOpenSnackbar('error', 'Error: Loading roles: getroles not exists in query data');
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading roles: ' + error);
            });
    };

    getRegionsRoles = () => {
        this.props.client
            .query({
                query: GET_REGIONS_ROLES_QUERY,
                variables: {
                    RolId: this.state.data.map(d => d.Id),
                    isActive: true
                },
                fetchPolicy: 'no-cache'
            })
            .then(({data}) => {
                if (data.regionsRolesByRolesId != null) {
                    this.setState({
                        regionsRoles: data.regionsRolesByRolesId
                    });
                } else {
                    this.props.handleOpenSnackbar('error', 'Error: Loading regions roles');
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading regions roles: ' + error);
            });
    }

    loadCompanies = () => {
        this.props.client
            .query({
                query: GET_COMPANY_QUERY,
                variables: {},
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getcompanies != null) {
                    this.setState(
                        {
                            company: data.data.getcompanies,
                            companiesOpt: data.data.getcompanies.map(c => {
                                return {value: c.Id, label: c.Name }
                            })
                        },
                        () => {
                            //this.resetState();
                            this.loadForms();
                        }
                    );
                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading Companies: getCompany not exists in query data'
                    );
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Companies: ' + error);
            });
    };

    loadForms = () => {
        this.props.client.query({
            query: GET_FORMS_QUERY,
            variables: {},
            fetchPolicy: 'no-cache'
        }).then(({data}) => {
            if(!data) this.props.handleOpenSnackbar('error', 'Error: Loading roles: ');

            let {getforms} = data;
            this.setState({
                forms: getforms.map(item => {
                    return {value: item.Id, label: item.Name ? item.Name.trim() : '', key: item.Id}
                })
            });
        }).catch((error) => {
            this.props.handleOpenSnackbar('error', 'Error: Loading roles: ' + error);
        });
    }

    loadRegions = () => {
        this.props.client.query({
            query: GET_REGIONS_QUERY,
            fetchPolicy: 'no-cache'
        }).then(({data}) => {
            if(!data) this.props.handleOpenSnackbar('error', 'Error: Loading regions: ');
            this.setState({
                regionsOpt: data.getcatalogitem.map(r => {
                    return {value: r.Id, label: r.Name, key:r.Id}
                })
            });
        }).catch((error) => {
            this.props.handleOpenSnackbar('error', 'Error: Loading regions: ' + error);
        });
    };

    insertOrUpdateRoles = (rolToSave) => {
        let {isEdition, regionsId, ...rol} = rolToSave;
        console.log('rol a guardar - ', rolToSave); // TODO: (LF) Quitar console log
        this.props.client
            .mutate({
                mutation: isEdition ? UPDATE_ROLES : INSERT_ROLES,
                variables: {
                    rol: rol,
                    regionsId: regionsId
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', isEdition ? 'Roles Updated!' : 'Roles Inserted!');
                this.loadRoles();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    isEdition ? 'Error: Updating Roles: ' + error : 'Error: Inserting Roles: ' + error
                );
            });
    };

    deleteRoles = () => {
        this.setState(
            {
                loadingConfirm: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: DELETE_ROLES,
                        variables: {
                            Id: this.state.idToDelete
                        }
                    })
                    .then((data) => {
                        this.props.handleOpenSnackbar('success', 'Role Deleted!');
                        this.loadRoles();
                        //this.resetState();
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar('error', 'Error: Deleting Role: ' + error);
                        this.setState({
                            loadingConfirm: false
                        });
                    });
            }
        );
    };

    handleCloseAlertDialog = () => {
        this.setState({openDeleteConfirm: false});
    };

    handleConfirmAlertDialog = () => {
        this.deleteRoles();
    };

    handleNewRolClick = () => {
        this.setState({
            openRolesModal: true
        });
    };

    // handleChangeForms = (formSelected) => {
    //     this.setState({ formSelected });
    // };

    onEditHandler = (rolId) => {
        const {data, regionsRoles} = this.state;
        const rolEdit = data.find(r => r.Id === rolId);
        const regionsId = regionsRoles.filter(rr => rr.RolId === rolId).map(rr => rr.RegionId);
        if(!rolEdit) return this.props.handleOpenSnackbar('error', 'Error: Rol not found ');

        this.setState({
            rolToEdit: {...rolEdit, regionsId },
            openRolesModal: true
        });
    }

    onDeleteHandler = (idSearch) => {
        this.setState({idToDelete: idSearch, openDeleteConfirm: true});
    };

    //TODO: (LF) Descomentar esta onda
    componentWillMount() {
        this.loadRoles();
        this.loadCompanies();
        this.loadRegions();
    }

    render() {
        let {openRolesModal, company, companiesOpt, forms, regionsRoles, regionsOpt, rolToEdit} = this.state;
        return <Fragment>
            <AlertDialogSlide
                handleClose={this.handleCloseAlertDialog}
                handleConfirm={this.handleConfirmAlertDialog}
                open={this.state.openDeleteConfirm}
                loadingConfirm={this.state.loadingConfirm}
                content="Do you really want to continue whit this operation?"
            />

            <div className="row">
                <div className="col-10"></div>
                
                <div className="col-2">
                    <button className="btn btn-success float-right" onClick={this.handleNewRolClick}>
                        Add Rol <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <RolesTable
                        data={this.state.data}
                        dataForms={this.state.dataForms}
                        company={company}
                        regionsRoles={regionsRoles}
                        regions={regionsOpt}
                        loading={this.state.loading}
                        onEditHandler={this.onEditHandler}
                        onDeleteHandler={this.onDeleteHandler}
                    />
                </div>
            </div>

            <RolesModal 
                title={rolToEdit ? 'Edit Rol' : 'New Rol'}
                open={openRolesModal}
                rol={rolToEdit}
                handleClose={this.handleCloseRolesModal}
                companies={companiesOpt}
                forms={forms}
                regions={regionsOpt}
                handleSaveRol={this.insertOrUpdateRoles}
            />
        </Fragment>
    }
}

export default withApollo(withGlobalContent(Roles));

// TODO: (LF) Quitar codigo comentado
//import RolesForm from './RolesForm';
//export default RolesForm;
