import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import {withApollo} from 'react-apollo';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import 'ui-components/InputForm/index.css';
import './index.css';
import withGlobalContent from 'Generic/Global';
import days from './days.json';
import periods from './periods.json';
import {LIST_PAYROLLS} from "./queries";
import {ADD_PAYROLL, UPDATE_PAYROLL} from "./mutations";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

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
    contactControl: {width: '535px', paddingRight: '0px'},
    rolControl: {width: '260px', paddingRight: '0px'},
    languageControl: {width: '260px', paddingRight: '0px'},
    usernameControl: {
        width: '150px'
    },
    fullnameControl: {
        width: '300px'
    },
    emailControl: {
        width: '350px'
    },
    numberControl: {
        //width: '150px'
    },
    passwordControl: {
        width: '120px'
    },

    resize: {
        //width: '200px'
    },
    divStyle: {
        width: '95%',
        display: 'flex'
        //justifyContent: 'space-around'
    },
    divStyleColumns: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingLeft: '40px'
    },
    divAddButton: {
        display: 'flex',
        justifyContent: 'end',
        width: '95%',
        heigth: '60px'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    },
    wrapper: {
        margin: theme.spacing.unit,
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

class PayRoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filterText: '',

            edit: false,

            payrollId: null,
            ...this.PAYROLL_STATE
        };
    }

    PAYROLL_STATE = {
        weekStart: null,
        payPeriod: null,
        lastPayPeriod: null
    };

    handleEdit = () => {
        this.setState({
            edit: !this.state.edit
        })
    };

    /**
     * Call a mutation to create if a record has never been created,
     * otherwise a mutation returns to update the record
     */
    executeMutation = () => {
        if (this.state.data.length > 0) {
            this.updatePayRoll();
        } else {
            this.savePayRoll()
        }
    };

    /**
     * To save a payroll with default PAYROLL_STATE
     */
    savePayRoll = () => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .mutate({
                    mutation: ADD_PAYROLL,
                    variables: {
                        payroll: {
                            ...this.PAYROLL_STATE
                        }
                    }
                })
                .then()
                .catch()
        });
    };

    /**
     * To update a payroll with default PAYROLL_STATE
     */
    updatePayRoll = () => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .mutate({
                    mutation: UPDATE_PAYROLL,
                    variables: {
                        payroll: {
                            id: this.state.payrollId,
                            ...this.PAYROLL_STATE
                        }
                    }
                })
                .then()
                .catch()
        });
    };


    /**
     * Method to fetch a list of payrolls
     */
    fetchPayrolls = () => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: LIST_PAYROLLS
                })
                .then(({data}) => {
                    this.setState({
                        data: data.listPayrolls,
                        id: data.listPayrolls[0].id,
                        edit: true
                    }, () => {
                        this.setState({
                            loading: false
                        })
                    })
                })
                .catch()
        });
    };

    componentWillMount() {
        this.fetchPayrolls();
    }

    render() {
        const {loading} = this.state;

        // If the query is loading return a LinearProgress
        if (loading) return <LinearProgress/>;

        // When the data finishes loading, show it in the form
        return (
            <div className="users_tab">
                <div className="row">
                    <div className="col-md-12">
                        <div className="">
                            <div className="row">
                                <form className="col-md-6" onSubmit={this.executeMutation}>
                                    <div className="card">
                                        <div className="card-header">How do you run payroll?
                                            {
                                                this.state.edit ? (
                                                    <div className="float-right">
                                                        <button className="btn btn-success"
                                                                onClick={this.handleEdit}>Edit <i
                                                            className="far fa-edit"></i></button>
                                                    </div>
                                                ) : (
                                                    ''
                                                )
                                            }
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label className="">What is your week start day (for calculating
                                                        overtime)?</label>
                                                    <select name="week-start" id="week-start" className="form-control"
                                                            required={true}>
                                                        <option value="">Select day</option>
                                                        {
                                                            days.map(item => (
                                                                <option value={item.id}>{item.name}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="">How often do you payroll?</label>
                                                    <select name="week-start" id="week-start" className="form-control"
                                                            required={true}>
                                                        <option value="">Select pay period</option>
                                                        {
                                                            periods.map(item => (
                                                                <option value={item.id}>{item.name}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="">What was your last pay period closing
                                                        date?</label>
                                                    <input type="date" className="form-control" required={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            !this.state.edit ? (
                                                <div className="card-footer">
                                                    <div className="d-flex justify-content-center">
                                                        <button
                                                            className="btn btn-success mr-1"
                                                            type="submit"
                                                        >
                                                            Save <i className="far fa-save"/>
                                                        </button>
                                                        <button
                                                            type="reset"
                                                            className="btn btn-danger ml-1"
                                                            onClick={this.handleEdit}>Cancel <i className="fas fa-ban"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                ''
                                            )
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(withApollo(withMobileDialog()(withGlobalContent(PayRoll))));

