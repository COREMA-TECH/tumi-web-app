import React, { Component, Fragment } from 'react';
import RolesModal from './RolesModal';
import RolesTable from './RolesTable';
import withGlobalContent from 'Generic/Global';
import {withApollo} from 'react-apollo';
import {GET_ROLES_QUERY, GET_COMPANY_QUERY, GET_FORMS_QUERY} from './Queries';
import {INSERT_ROLES, UPDATE_ROLES, DELETE_ROLES} from './Mutations';
import AlertDialogSlide from 'Generic/AlertDialogSlide';

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
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
            saving: false,
            filterText: null,
            allRoles: []
        };
    }

    handleCloseRolesModal = () => {
        this.setState({
            openRolesModal: false,
            rolToEdit: null
        });
    }

    dataFilter = (e) => {
        const filterText = e.currentTarget.value;
        const {allRoles} = this.state;
        if(filterText) {
            const text = filterText.toLowerCase();
            this.setState({
                filterText: text,
                data: allRoles.filter(r => r.Description.toLowerCase().indexOf(text) > -1)
            });
        }
        else{
            this.setState({
                filterText,
                data: allRoles
            });
        }
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
                            allRoles: data.data.getroles,
                            dataForms: data.data.getforms
                        });
                } else {
                    this.props.handleOpenSnackbar('error', 'Error: Loading roles: getroles not exists in query data');
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading roles: ' + error);
            });
    };

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

    insertOrUpdateRoles = (rolToSave) => {
        let {isEdition, ...rol} = rolToSave;
        console.log('rol a guardar - ', rolToSave); // TODO: (LF) Quitar console log
        console.log('rol a guardar 2- ', rol); // TODO: (LF) Quitar console log
        this.setState({
            saving: true    
        }, _ => {
            this.props.client
                .mutate({
                    mutation: isEdition ? UPDATE_ROLES : INSERT_ROLES,
                    variables: {
                        rol
                    }
                })
                .then((data) => {
                    this.setState({
                        saving: false,
                        rolToEdit: null,
                        openRolesModal: false
                    }, _ => {
                        this.props.handleOpenSnackbar('success', isEdition ? 'Roles Updated!' : 'Roles Inserted!');
                        this.loadRoles();
                    });
                })
                .catch((error) => {
                    this.setState({
                        saving: false,
                        rolToEdit: {...rol}
                    });
                    this.props.handleOpenSnackbar(
                        'error',
                        isEdition ? 'Error: Updating Roles: ' + error : 'Error: Inserting Roles: ' + error
                    );
                });
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
                        this.setState({
                            openDeleteConfirm: false,
                            loadingConfirm: false
                        });
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar('error', 'Error: Deleting Role: ' + error);
                        this.setState({
                            openDeleteConfirm: false,
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

    onEditHandler = (rolId) => {
        const {data} = this.state;
        const rolEdit = data.find(r => r.Id === rolId);
        if(!rolEdit) return this.props.handleOpenSnackbar('error', 'Error: Rol not found ');

        this.setState({
            rolToEdit: {...rolEdit },
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
    }

    render() {
        let {openRolesModal, company, companiesOpt, forms, rolToEdit} = this.state;
        return <Fragment>
            <AlertDialogSlide
                handleClose={this.handleCloseAlertDialog}
                handleConfirm={this.handleConfirmAlertDialog}
                open={this.state.openDeleteConfirm}
                loadingConfirm={this.state.loadingConfirm}
                content="Do you really want to continue whit this operation?"
            />

            <div className="row d-flex justify-content-between">
                <div className="col-md-3">
                    <div className="input-group mb-2">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								<i className="fa fa-search icon" />
							</span>
						</div>
						<input
							onChange={this.dataFilter}
							value={this.state.filterText}
							type="text"
							placeholder="Rol Search"
							className="form-control"
						/>
					</div>
                </div>
                
                <div className="col-md-2">
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
                handleSaveRol={this.insertOrUpdateRoles}
                saving={this.state.saving}
            />
        </Fragment>
    }
}

export default withApollo(withGlobalContent(Roles));
