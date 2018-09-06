import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import blue from '@material-ui/core/colors/blue';
import Query from "react-apollo/Query";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import {gql} from "apollo-boost";
import InputForm from "../InputForm/InputForm";
import './index.css';
import withApollo from "react-apollo/withApollo";

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class SimpleDialog extends Component {
    state = {
        firstName: '',
        createdCompany: false,
        data: []
    };


    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    handleListItemClick = value => {
        this.props.onClose(value);
    };

    ADD_COMPANY = gql`
        mutation insertCompanies($input: iParamBC!) {
            insbusinesscompanies(input: $input) {
                Id
            }
        }
    `;

    insertCompany = () => {
        //Create the mutation using apollo global client
        this.props.client
            .mutate({
                // Pass the mutation structure
                mutation: this.ADD_COMPANY,
                variables: {
                    input: {
                        Id: 150,
                        Code: `''`,
                        Code01: `''`,
                        Id_Company: 1,
                        Id_Contract: 1,
                        BusinessType: 1,
                        Location: `''`,
                        Location01: `''`,
                        Name: `'${this.state.firstName}'`,
                        Description: `''`,
                        Start_Week: 0,
                        End_Week: 0,
                        Legal_Name: `''`,
                        Country: 6,
                        State: 10,
                        Rate: parseFloat(0),
                        Zipcode: parseInt(50),
                        Fax: `''`,
                        Primary_Email: `''`,
                        Phone_Number: `''`,
                        Phone_Prefix: `''`,
                        City: parseInt(140),
                        Id_Parent: 1,
                        IsActive: parseInt(1),
                        User_Created: 1,
                        User_Updated: 1,
                        Date_Created: "'2018-08-14'",
                        Date_Updated: "'2018-08-14'",
                        ImageURL: `''`,
                        Start_Date: "'2018-08-14'",
                        Contract_URL: "'firebase url'",
                        Insurace_URL: "'firebase url'",
                        Other_URL: "'firebase url'",
                        Other01_URL: "'firebase url'",
                        Suite: parseInt(10),
                        Contract_Status: "'C'",
                    }
                }
            })
            .then((data) => {
                console.log("Server data response is: " + data);
            })
            .catch((err) => console.log("The error is: " + err));
    };


    /**
     * QUERY to get companies
     */
    getCompaniesQuery = gql`
        {
            getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: "'C'") {
                Id
                Name
                Id_Company
            }
        }
    `;

    /**
     * QUERY to get customer (Contact)
     */
    getContactsQuery = gql`
        query States($Id_Entity: Int)
        {
            getcontacts(Id: null, IsActive: 1, Id_Entity: $Id_Entity) {
                Id
                First_Name
            }
        }
    `;

    getCompanies = () => {
        this.props.client.query({
            query: this.getContactsQuery
        })
            .then(item => {
                this.setState(prevState => ({
                    data: item
                }))
            })
            .catch((err) => {
                console.log(err)
            })
    };

    componentWillMount() {
        this.getCompanies();
    }

    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;


        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <DialogTitle id="simple-dialog-title">Select an Account</DialogTitle>
                <div>
                    <List>
                        <Query
                            query={this.getCompaniesQuery}
                            pollInterval={500}
                        >
                            {({loading, error, data, refetch, networkStatus}) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress/>;
                                if (error) return <p>Error </p>;
                                if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {
                                    console.log("Data of cities" + data.getbusinesscompanies);
                                    //return <SelectFormCompany data={data.getcompanies} addCompany={this.handleClickOpen} update={this.updateCompany} />
                                    return (
                                        data.getbusinesscompanies.map((item) => (
                                            <ListItem button onClick={() => {
                                                this.handleListItemClick(item.Name);
                                                this.props.onId(item.Id);
                                                this.props.onItemValue(parseInt(item.Id_Company));
                                            }}
                                                      key={item.Id}>
                                                <ListItemAvatar>
                                                    <Avatar className={classes.avatar}>
                                                        <PersonIcon/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={item.Name}/>
                                            </ListItem>
                                        ))
                                    )
                                }
                                return <p>Nothing to display </p>;
                            }}
                        </Query>
                        <div className="add-account-in-dialog">
                            <ListItem button onClick={() => {
                                this.insertCompany();
                                this.setState({
                                    firstName: '',
                                    createdCompany: true
                                });
                            }}
                                      className="add-account-in-dialog--button">
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                            </ListItem>
                            <div className="card-form-row">
                                <span className="input-label primary">Account Name</span>
                                <InputForm
                                    value={this.state.firstName}
                                    change={(text) => {
                                        this.setState({
                                            firstName: text
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </List>
                </div>
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(withApollo(SimpleDialog));

class SimpleDialogDemo extends React.Component {
    state = {
        open: false,
        selectedValue: '',
    };

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = value => {
        this.setState({selectedValue: value, open: false});
    };

    idCompanySelected = value => {
        //TODO: PASARLO AL COMPONENTE PADRE
        this.props.update(value);
    };

    nameCompanySelected = value => {

    };


    render() {
        return (
            <div>
                <div className="input-file-container">
                    <input
                        value={this.state.selectedValue}
                        type="text"
                        className="input-form input-form--file"
                    />
                    <span className="input-form--file-button primary-button" onClick={this.handleClickOpen}>
                        <span className="icon-drop"></span>
                    </span>
                </div>
                <SimpleDialogWrapped
                    selectedValue={this.state.selectedValue}
                    open={this.state.open}
                    onClose={this.handleClose}
                    onId={this.idCompanySelected}
                    onItemValue={(id) => {
                        this.props.updateCompanySignedBy(id);
                    }}
                />
            </div>
        );
    }
}

export default SimpleDialogDemo;