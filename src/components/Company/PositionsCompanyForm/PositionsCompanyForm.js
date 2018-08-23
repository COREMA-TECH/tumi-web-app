import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import PositionsTable from "./PositionsTable";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import Select from "../../material-ui/Select";
import Query from "react-apollo/Query";
import {gql} from "apollo-boost";
import Button from "@material-ui/core/es/Button/Button";
import Mutation from "react-apollo/Mutation";

const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px'
    },
    formControl: {
        margin: theme.spacing.unit,
        width: '18%'
    },
    divStyle: {
        width: '80%',
        display: 'flex',
        justifyContent: 'space-around'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    }
});

class PositionsCompanyForm extends React.Component {
    state = {
        name: '',
        data: [],
        idPosition: 1,
        department: '',
        position: '',
        billRate: '',
        payRate: ''
    };

    getDepartmentsQuery = gql`
        {
            getcatalogitem(Id: null, IsActive: 1, Id_Parent: null, Id_Catalog: 8) {
                Id
                Name
                IsActive
            }
        }
    `;

    updateStateDepartment = (id) => {
        this.setState({
            department: id
        });
    };

    deletePositionById = (id) => {
        //Write mutation to delete the position


    };



    validateAllState() {
        return (
            this.state.department === '' ||
            this.state.billRate === '' ||
            this.state.payRate === '' ||
            this.state.position === '');
    }

    render() {
        const {classes} = this.props;

        const ADD_POSITION = gql`
            mutation insertCompanies($input: iParamPR!) {
                insposition(input: $input) {
                    Id
                }
            }
        `;

        return (
            <div className={classes.container}>
                <div className={classes.divStyle}>
                    <FormControl className={classes.formControl}>
                        <Query query={this.getDepartmentsQuery}>
                            {({loading, error, data, refetch, networkStatus}) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress/>;
                                if (error) return <p>Error </p>;
                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                    return (
                                        <Select label={"Departments"}
                                                update={this.updateStateDepartment}
                                                value={this.state.state}
                                                values={data.getcatalogitem}/>
                                    )
                                }

                                return <p>Nothing to display </p>;
                            }}
                        </Query>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Position</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.position}
                            onChange={(text) => this.setState({position: text.target.value})}
                        />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Pay Rate</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.payRate}
                            onChange={
                                (text) => this.setState({
                                    payRate: text.target.value,
                                    billRate: (parseFloat(text.target.value) * 1.37)
                                })
                            }
                        />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Bill Rate</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.billRate}
                            onChange={
                                (text) => this.setState({
                                    payRate: (parseFloat(text.target.value) / 1.37),
                                    billRate: text.target.value
                                })
                            }
                        />
                    </FormControl>
                    <Mutation mutation={ADD_POSITION}>
                        {(insposition, {loading, error}) => (
                            <Button variant="contained"
                                    color="primary"
                                    disabled={this.validateAllState()}
                                    className={classes.button}
                                    onClick={
                                        () => {
                                            insposition({
                                                    variables: {
                                                        "input": {
                                                            "Id": 0,
                                                            "Id_Entity": 1,
                                                            "Id_Department": parseInt(this.state.department),
                                                            "Position": `'${this.state.position}'`,
                                                            "Bill_Rate": parseFloat(this.state.billRate),
                                                            "Pay_Rate": parseFloat(this.state.payRate),
                                                            "IsActive": 1,
                                                            "User_Created": 1,
                                                            "User_Updated": 1,
                                                            "Date_Created": "'2018-08-14 16:10:25+00'",
                                                            "Date_Updated": "'2018-08-14 16:10:25+00'"
                                                        }
                                                    }
                                                }
                                            );

                                            let item = {
                                                department: this.state.department,
                                                position: this.state.position,
                                                billRate: this.state.billRate,
                                                payRate: this.state.payRate
                                            };

                                            this.setState(prevState => ({
                                                data: [item, ...prevState.data],
                                                position: '',
                                                billRate: '',
                                                payRate: ''
                                            }));
                                        }
                                    }>
                                Add Position
                            </Button>

                        )}
                    </Mutation>
                </div>
                <div className={classes.divStyle}>
                    <PositionsTable data={this.state.data}/>
                </div>
                <br/><br/><br/><br/><br/>

            </div>
        );
    }
}

PositionsCompanyForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PositionsCompanyForm);
