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
import AddIcon from '@material-ui/icons/Add';
import blue from '@material-ui/core/colors/blue';
import Query from "react-apollo/Query";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import {gql} from "apollo-boost";

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class SimpleDialog extends React.Component {
    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    handleListItemClick = value => {
        this.props.onClose(value);
    };


    /**
     * QUERY to get companies
     */
    getCompaniesQuery = gql`
        {
            getcompanies(Id: null, IsActive: 1) {
                Id
                Name
            }
        }
    `;

    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;

        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <DialogTitle id="simple-dialog-title">Select an Account</DialogTitle>
                <div>
                    <List>
                        <Query query={this.getCompaniesQuery}>
                            {({loading, error, data, refetch, networkStatus}) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress/>;
                                if (error) return <p>Error </p>;
                                if (data.getcompanies != null && data.getcompanies.length > 0) {
                                    console.log("Data of cities" + data.getcompanies);
                                    //return <SelectFormCompany data={data.getcompanies} addCompany={this.handleClickOpen} update={this.updateCompany} />
                                    return (
                                        data.getcompanies.map((item) => (
                                            <ListItem button onClick={() => {
                                                this.handleListItemClick(item.Name);
                                                this.props.onId(item.Id);
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
                        <ListItem button onClick={() => this.handleListItemClick('addAccount')}>
                            <ListItemAvatar>
                                <Avatar>
                                    <AddIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="add account"/>
                        </ListItem>
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

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

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

        alert(value);
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
                />
            </div>
        );
    }
}

export default SimpleDialogDemo;