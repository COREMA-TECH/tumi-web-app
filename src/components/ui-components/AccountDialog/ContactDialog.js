import React from 'react';
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
import blue from '@material-ui/core/colors/blue';
import Query from "react-apollo/Query";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import {gql} from "apollo-boost";
import './index.css';
import withApollo from "react-apollo/withApollo";
import ContactFormContract from "../../Contract/ContactFormContract/ContactFormDialog";

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class SimpleDialog extends React.Component {
    state = {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        createdCompany: false
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

    ADD_CONTRACT = gql`
        mutation inscontacts($input: iParamC) {
            inscontacts(input: $input) {
                Id
            }
        }
    `;

    insertCompany = () => {
        this.props.client
            .mutate({
                // Pass the mutation structure
                mutation: this.ADD_CONTRACT,
                variables: {
                    input: {
                        Id: 150,
                        Id_Entity: parseInt(this.props.idContact),
                        First_Name: `'${this.state.firstName}'`,
                        Middle_Name: `'${this.state.middleName}'`,
                        Last_Name: "''",
                        Electronic_Address: `'${this.state.email}'`,
                        Phone_Number: `'${this.state.phoneNumber}'`,
                        Contact_Type: 1,
                        IsActive: 1,
                        User_Created: 1,
                        User_Updated: 1,
                        Date_Created: "'2018-08-14'",
                        Date_Updated: "'2018-08-14'",
                        Id_Supervisor: 1,
                        Id_Deparment: 1,
                    }
                }
            })
            .then((data) => {
                console.log("Server data contact created" + data);
            })
            .catch((err) => console.log("The error is: " + err));
    };


    /**
     * QUERY to get companies
     */
    getCompaniesQuery = gql`
        {
            getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null) {
                Id
                Name
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
                Last_Name
                Electronic_Address
            }
        }
    `;

    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;
        return (
            <Dialog
                contentStyle={{width: "100%", maxWidth: "none"}}
                className="dialog-contact" onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <DialogTitle id="simple-dialog-title">Select a Customer</DialogTitle>
                <div>
                    <List>
                        <div className="list-item-container-scroll">
                            <Query query={this.getContactsQuery}
                                   pollInterval={500}
                                   variables={{Id_Entity: parseInt(this.props.idContact)}}
                            >
                                {({loading, error, data, refetch, networkStatus}) => {
                                    //if (networkStatus === 4) return <LinearProgress />;
                                    if (loading) return <LinearProgress/>;
                                    if (error) return <p>Error </p>;
                                    if (data.getcontacts != null && data.getcontacts.length > 0) {
                                        console.log("Data of cities" + data.getcontacts);
                                        //return <SelectFormCompany data={data.getcompanies} addCompany={this.handleClickOpen} update={this.updateCompany} />
                                        return (
                                            data.getcontacts.map((item) => (

                                                <ListItem button onClick={() => {
                                                    this.handleListItemClick(item.First_Name.trim() + " " + item.Last_Name.trim());
                                                    this.props.onId(item.Id);
                                                    this.props.updateEmailContact(item.Electronic_Address)
                                                }}
                                                          key={item.Id}>
                                                    <ListItemAvatar>
                                                        <Avatar className={classes.avatar}>
                                                            <PersonIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={item.First_Name + item.Last_Name}/>
                                                </ListItem>
                                            ))
                                        )
                                    }
                                    return <p>Nothing to display </p>;
                                }}
                            </Query>

                        </div>
                    </List>

                    <ContactFormContract idContact={this.props.idContact}/>
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


    idCustomerSelected = value => {
        //TODO: PASARLO AL COMPONENTE PADRE
      

        this.props.update(value);
    };

    emailCompanySelected = value => {
        this.props.updateEmailContact(value)
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
                    onId={this.idCustomerSelected}
                    updateEmailContact={this.emailCompanySelected}
                    idContact={this.props.idContact}
                />
            </div>
        );
    }
}

export default SimpleDialogDemo;