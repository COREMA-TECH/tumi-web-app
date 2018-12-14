import React, {Component} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import green from "@material-ui/core/colors/green";
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core";
import withApollo from "react-apollo/withApollo";
import {ADD_EMPLOYEES, DELETE_EMPLOYEE} from "./Mutations";
import EmployeeInputRow from "./EmployeeInputRow";
import EmployeesTable from "./EmployeesTable";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import ErrorMessageComponent from "../ui-components/ErrorMessageComponent/ErrorMessageComponent";
import TablesContracts from "../Contract/Main/MainContract/TablesContracts";
import {Query} from "react-apollo";
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import {
    LIST_EMPLOYEES
} from './Queries';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import withGlobalContent from 'Generic/Global';

const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px',
        width: '100%'
    },
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    formControl: {
        margin: theme.spacing.unit
        //width: '100px'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    },
    wrapper: {
        position: 'relative'
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700]
        }
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
});

class Employees extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            employeesRegisters: [],
            rowsInput: [1],
            inputs: 1,
            filterText: '',
        }
    }

    /**
     * To open modal updating the state
     */
    handleClickOpenModal = () => {
        this.setState({openModal: true});
    };

    /**
     * To hide modal and then restart modal state values
     */
    handleCloseModal = () => {
        this.setState({
            openModal: false
        }, () => {
            this.setState({
                rowsInput: [1]
            })
        });
    };

    /**
     * Manage submit form
     * @param e - event submit of the form
     */
    handleSubmit = (e) => {
        // Stop submit propagation and prevent even default
        e.preventDefault();
        e.stopPropagation();

        let form = document.getElementById('employee-form');

        let array = [];
        let object = {};

        for (let i = 1; i <= form.elements.length - 2; i++) {
            if (form.elements.item(i).name == "firstName") {
                console.log(form.elements.item(i).value);
                object.firstName = form.elements.item(i).value;
            } else if (form.elements.item(i).name == "lastName") {
                object.lastName = form.elements.item(i).value;
            } else if (form.elements.item(i).name == "email") {
                object.electronicAddress = form.elements.item(i).value;
            } else if (form.elements.item(i).name == "number") {
                object.mobileNumber = form.elements.item(i).value;
            }


            console.log(i % 4);
            if (i % 4 === 0) {
                console.log(object);
                alert(object);
                array.push(object);
                console.log(array);
                alert(array);
            }

        }



        //this.insertEmployees([]);
    };

    insertEmployees = (employeesArrays) => {
        this.props.client
            .mutate({
                mutation: ADD_EMPLOYEES,
                variables: {
                    Employees: employeesArrays
                }
            })
            .then(({data}) => {

                // Hide dialog
                this.handleCloseModal();
            })
            .catch(error => {
                // Hide dialog
                this.handleCloseModal();
            })
    };

    deleteEmployeeById = (id) => {
        this.setState({
            idToDelete: id
        }, () => {
            this.setState({
                opendialog: true, loadingRemoving: false, loadingContracts: false
            })
        });
    };

    deleteEmployee = () => {
        alert(this.state.idToDelete);
        this.setState(
            {
                loadingRemoving: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: DELETE_EMPLOYEE,
                        variables: {
                            id: this.state.idToDelete
                        }
                    })
                    .then((data) => {
                        this.setState(
                            {
                                opendialog: false,
                                loadingRemoving: false
                            },
                            () => {
                                this.props.handleOpenSnackbar('success', 'Employee Deleted!');
                            }
                        );
                    })
                    .catch((error) => {
                        this.setState(
                            {
                                opendialog: false,
                                loadingRemoving: false
                            },
                            () => {
                                this.props.handleOpenSnackbar('error', 'Error: Deleting Employee: ' + error);
                            }
                        );
                    });
            }
        );
    };

    /**
     * To create a new row form
     */
    addNewRow = () => {
        this.setState(prevState => ({
            rowsInput: [...prevState.rowsInput, 1]
        }))
    };

    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    };

    handleCloseAlertDialog = () => {
        this.setState({ opendialog: false });
    };
    handleConfirmAlertDialog = () => {
        this.deleteEmployee()
    };

    render() {
        const {classes} = this.props;
        const {fullScreen} = this.props;

        let renderHeaderContent = () => (
            <div className="row">
                <div className="col-md-6">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1">
								<i className="fa fa-search icon"/>
							</span>
                        </div>
                        <input
                            onChange={(text) => {
                                this.setState({
                                    filterText: text.target.value
                                });
                            }}
                            value={this.state.filterText}
                            type="text"
                            placeholder="Search employees"
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <button
                        className="btn btn-success float-right"
                        onClick={this.handleClickOpenModal}
                    >
                        Add Employees
                    </button>
                </div>
            </div>
        );

        let renderNewEmployeeDialog = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                aria-labelledby="responsive-dialog-title"
                maxWidth="lg"
            >
                <form id="employee-form" onSubmit={this.handleSubmit}>
                    <DialogTitle style={{padding: '0px'}}>
                        <div className="modal-header">
                            <h5 class="modal-title">New Employees</h5>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="">* First Name</label>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="">* Last Name</label>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="">* Email Address</label>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="">* Phone Number</label>
                                </div>
                            </div>
                            {
                                this.state.rowsInput.map((index, item) => (
                                    <EmployeeInputRow
                                        newRow={this.addNewRow}
                                        index={index}
                                        onchange={this.handleChange}
                                    />
                                ))
                            }
                        </div>
                    </DialogContent>
                    <DialogActions style={{margin: '20px 20px'}}>
                        <div className={[classes.root]}>
                            <div className={classes.wrapper}>
                                <button
                                    type="submit"
                                    variant="fab"
                                    className="btn btn-success"
                                    onClick={this.insertDepartment}
                                >
                                    Save {!this.state.saving && <i class="fas fa-save"/>}
                                    {this.state.saving && <i class="fas fa-spinner fa-spin"/>}
                                </button>
                            </div>
                        </div>
                        <div className={classes.root}>
                            <div className={classes.wrapper}>
                                <button
                                    variant="fab"
                                    className="btn btn-danger"
                                    onClick={this.handleCloseModal}
                                >
                                    Cancel <i class="fas fa-ban"/>
                                </button>
                            </div>
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        );

        return (
            <div>
                <AlertDialogSlide
                    handleClose={this.handleCloseAlertDialog}
                    handleConfirm={this.handleConfirmAlertDialog}
                    open={this.state.opendialog}
                    loadingConfirm={this.state.loadingRemoving}
                    content="Do you really want to continue whit this operation?"
                />
                {
                    renderHeaderContent()
                }

                {
                    renderNewEmployeeDialog()
                }
                <Query query={LIST_EMPLOYEES} pollInterval={500}>
                    {({ loading, error, data, refetch, networkStatus }) => {
                        if (this.state.filterText === '') {
                            if (loading) return <LinearProgress />;
                        }

                        if (error)
                            return (
                                <ErrorMessageComponent
                                    title="Oops!"
                                    message={'Error loading contracts'}
                                    type="Error-danger"
                                    icon="danger"
                                />
                            );
                        if (data.employees != null && data.employees.length > 0) {
                            let dataEmployees = data.employees.filter((_, i) => {
                                if (this.state.filterText === '') {
                                    return true;
                                }

                                if (
                                    _.firstName.indexOf(this.state.filterText) > -1 ||
                                    _.firstName.toLocaleLowerCase().indexOf(this.state.filterText) > -1 ||
                                    _.firstName.toLocaleUpperCase().indexOf(this.state.filterText) > -1
                                ) {
                                    return true;
                                }
                            });

                            return (
                                <div className="">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="">
                                                <EmployeesTable
                                                    data={dataEmployees}
                                                    delete={(id) => {
                                                        this.deleteEmployeeById(id);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <NothingToDisplay
                                title="Oops!"
                                message={'There are no contracts'}
                                type="Error-success"
                                icon="wow"
                            />
                        );
                    }}
                </Query>
            </div>
        );
    }
}

Employees.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(Employees)));