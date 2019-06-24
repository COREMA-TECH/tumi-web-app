import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import blue from '@material-ui/core/colors/blue';
import Query from 'react-apollo/Query';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { gql } from 'apollo-boost';
import './index.css';
import withApollo from 'react-apollo/withApollo';
import ManagementCompanyDialog from '../../Contract/ManagementCompany/ManagementCompanyDialog';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from "../../material-ui/CircularProgress";
import DeleteIcon from '@material-ui/icons/Delete';
import Mutation from "react-apollo/Mutation";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/es/Button/Button";
import AppBar from "@material-ui/core/AppBar/AppBar";
import IconButton from "@material-ui/core/IconButton/IconButton";

const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600]
    },
    appBar: {
        position: 'relative',
        background: '#3DA2C7'
    },
    flex: {
        flex: 1
    }
};

class SimpleDialog extends Component {
    state = {
        firstName: '',
        createdCompany: false,
        data: [],
        state: 0,
        city: 0
    };

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    handleListItemClick = (value) => {
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
                        Insurance_URL: "'firebase url'",
                        Other_URL: "'firebase url'",
                        Other01_URL: "'firebase url'",
                        Suite: parseInt(10),
                        Contract_Status: "'C'"
                    }
                }
            })
            .catch((err) => console.log('The error is: ' + err));
    };

    /**
     * QUERY to get companies
     */
    getCompaniesQuery = gql`
		{
			getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: "'C'",Id_Parent :0) {
				Id
				Name
				Id_Company
				ImageURL
			}
		}
	`;

    /**
     * QUERY to get customer (Contact)
     */
    getContactsQuery = gql`
		query States($Id_Entity: Int) {
			getcontacts(Id: null, IsActive: 1, Id_Entity: $Id_Entity) {
				Id
				First_Name
			}
		}
	`;

    deleteCompanyMutation = gql`
        mutation DeleteCompany($Id: Int!, $IsActive: Int!) {
            delbusinesscompanies(Id: $Id, IsActive: $IsActive) {
                Code
                Name
            }
        }
    `;

    getCompanies = () => {
        this.props.client
            .query({
                query: this.getContactsQuery
            })
            .then((item) => {
                this.setState((prevState) => ({
                    data: item
                }));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    componentWillMount() {
        this.getCompanies();
    }

    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;

        return (
            <Dialog
                fullScreen
                onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Select a Management Company
                        </Typography>
                        <Button color="inherit" onClick={this.handleClose}>
                            Cancel
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <List component="nav">
                        <Query query={this.getCompaniesQuery} pollInterval={500}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress />;
                                if (error) return <p>Error </p>;
                                if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {
                                    return data.getbusinesscompanies.map((item) => {
                                        return (
                                            <ListItem
                                                button
                                                onClick={() => {
                                                    this.handleListItemClick(item.Name);
                                                    this.props.onId(item.Id);
                                                    this.props.onItemValue(parseInt(item.Id_Company));
                                                }}
                                                key={item.Id}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar className={classes.avatar}>
                                                        <img className="avatar-uploaded" src={item.ImageURL} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={item.Name} />
                                                <Mutation mutation={this.deleteCompanyMutation}>
                                                    {(delbusinesscompanies, { loading, error }) => {
                                                        if (loading) return <CircularProgress />;

                                                        return (
                                                            <IconButton
                                                                disabled={this.props.loading}
                                                                onClick={
                                                                    (event) => {
                                                                        delbusinesscompanies({
                                                                            variables: {
                                                                                Id: item.Id,
                                                                                IsActive: 0
                                                                            }
                                                                        });

                                                                        event.stopPropagation();
                                                                    }}
                                                            >
                                                                <DeleteIcon color="primary" />
                                                            </IconButton>
                                                        );
                                                    }}
                                                </Mutation>
                                            </ListItem>
                                        );
                                    });
                                }
                                return <p>Nothing to display </p>;
                            }}
                        </Query>
                    </List>
                </DialogContent>
                <DialogActions>
                    <ManagementCompanyDialog handleOpenSnackbar={this.props.handleOpenSnackbar} />
                </DialogActions>
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string
};

const SimpleDialogWrapped = withStyles(styles)(withApollo(SimpleDialog));

class SimpleDialogDemo extends Component {
    state = {
        open: false,
        selectedValue: ''
    };

    GET_COMPANY_BY_ID = gql`
		query($Id: Int!) {
			getbusinesscompanies(Id: $Id, IsActive: 1, Contract_Status: "'C'") {
				Id
				Name
				Id_Company
			}
		}
	`;

    getContractById = (id) => {
        this.props.client
            .query({
                query: this.GET_COMPANY_BY_ID,
                variables: {
                    Id: parseInt(id)
                }
            })
            .then(({ data }) => {
                this.setState({
                    selectedValue: data.getbusinesscompanies[0].Name
                });

                this.props.updateCompanySignedBy(data.getbusinesscompanies[0].Id_Company);
            })
            .catch((err) => console.log(err));
    };

    handleClickOpen = () => {
        this.setState({
            open: true
        });
    };

    handleClose = (value) => {
        this.setState({ selectedValue: value, open: false });
    };

    idCompanySelected = (value) => {
        //TODO: PASARLO AL COMPONENTE PADRE
        this.props.update(value);
    };

    setValue = (text) => {
        this.setState((prevState) => ({
            selectedValue: [...prevState.data, text]
        }));
    };

    componentWillMount() {
        this.getContractById(this.props.valueSelected);
    }

    render() {
        return (
            <div>
                <div className="form-control">
                    <input
                        defaultValue={this.state.selectedValue}
                        type="text"
                        className={
                            this.props.error ? 'form-control-nonBorder _invalid' : 'form-control-nonBorder form-control-dialogSelect'
                        }
                        readOnly
                    />
                    <span className="input-form--file-button primary-button arrow-combo" onClick={this.handleClickOpen}>
                        <span className="icon-drop" />
                    </span>
                </div>
                <SimpleDialogWrapped
                    setDefaultText={this.setValue}
                    valueSelected={this.props.valueSelected}
                    selectedValue={this.state.selectedValue}
                    handleOpenSnackbar={this.props.handleOpenSnackbar}
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

export default withApollo(SimpleDialogDemo);
