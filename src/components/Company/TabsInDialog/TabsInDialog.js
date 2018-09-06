import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GeneralInforProperty from './GeneralInforProperty';
import ContactsProperty from "./Contacts/ContactsProperty";
import DepartmentsProperty from "./departments/DepartmentsProperty";
import ContactCompanyForm from "../ContactCompanyForm/ContactCompanyForm";
import Snackbar from "@material-ui/core/es/Snackbar/Snackbar";
import {MySnackbarContentWrapper} from "../../Generic/SnackBar";
import DepartmentsCompanyForm from "../DepartmentsCompanyForm/DepartmentsCompanyForm";
import PositionsCompanyForm from "../PositionsCompanyForm/PositionsCompanyForm";

const styles = theme => ({
    root: {
        justifyContent: 'center',
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        zIndex: '-1'
    },
    tabsRoot: {
        borderBottom: '2px solid #3DA2C7',
    },
    tabsIndicator: {
        backgroundColor: '#3DA2C7',
        borderRadius: '25px 25px 0px 0px',
        marginLeft: '5px',
        marginRight: '5px',
        height: '3px'
    },
    tabRoot: {
        fontSize: '28px',
        textTransform: 'initial',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing.unit * 4,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#3DA2C7',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#3DA2C7',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#3DA2C7',
        },
    },
    tabSelected: {},
    typography: {
        padding: theme.spacing.unit * 3,

    },
});

class CustomizedTabs extends Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openSnackbar: false });
    };

    handleOpenSnackbar = (variant, message) => {
        this.setState({
            openSnackbar: true,
            variantSnackbar: variant,
            messageSnackbar: message
        });
    };

    render() {
        const {classes} = this.props;
        const {value} = this.state;

        return (
            <div className={classes.root}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    open={this.state.openSnackbar}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnackbar}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleCloseSnackbar}
                        variant={this.state.variantSnackbar}
                        message={this.state.messageSnackbar}
                    />
                </Snackbar>
                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    classes={{root: classes.tabsRoot, indicator: classes.tabsIndicator}}
                >
                    <Tab
                        disableRipple
                        classes={{root: classes.tabRoot, selected: classes.tabSelected}}
                        label="General Information"
                    />
                    <Tab
                        disableRipple
                        classes={{root: classes.tabRoot, selected: classes.tabSelected}}
                        label="Contacts"
                    />
                    <Tab
                        disableRipple
                        classes={{root: classes.tabRoot, selected: classes.tabSelected}}
                        label="Departments"
                    />
                    <Tab
                        disableRipple
                        classes={{root: classes.tabRoot, selected: classes.tabSelected}}
                        label="Positions"
                    />
                </Tabs>
                {value === 0 && <GeneralInforProperty idCompany={this.props.idCompany}/>}
                {value === 1 && (
                    <ContactCompanyForm
                        idCompany={this.props.idCompany}
                        handleOpenSnackbar={this.handleOpenSnackbar}
                        item={this.state.item}
                        next={this.nextHandleChange}
                        back={this.backHandleChange}
                        valueTab={this.state.value}
                        showStepper={this.state.showStepper}
                        toggleStepper={this.toggleStepper}
                    />
                )}
                {value === 2 && (
                    <DepartmentsCompanyForm
                        idCompany={this.props.idCompany}
                        handleOpenSnackbar={this.handleOpenSnackbar}
                        item={this.state.item}
                        next={this.nextHandleChange}
                        back={this.backHandleChange}
                        valueTab={this.state.value}
                        showStepper={this.state.showStepper}
                        toggleStepper={this.toggleStepper}
                    />
                )}
                {value === 3 && (
                    <PositionsCompanyForm
                        idCompany={this.props.idCompany}
                        idContract={1}
                        handleOpenSnackbar={this.handleOpenSnackbar}
                        item={this.state.item}
                        next={this.nextHandleChange}
                        back={this.backHandleChange}
                        valueTab={this.state.value}
                        showStepper={this.state.showStepper}
                        toggleStepper={this.toggleStepper}
                    />
                )}
            </div>
        );
    }
}

CustomizedTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTabs);