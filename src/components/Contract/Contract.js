import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NewContract from "./NewContract/NewContract";
import ExhibitContract from "./ExhibitContract/ExhibitContract";

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
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

class Contract extends React.Component {
    state = {
        value: 0,
        contractId: 0
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    updateContractId = id => {
        this.setState({
            contractId: id,
            value: 1
        })
    };

    render() {
        const {classes} = this.props;
        const {value} = this.state;

        return (
            <div className={classes.root}>
                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    classes={{root: classes.tabsRoot, indicator: classes.tabsIndicator}}
                >
                    <Tab
                        disableRipple
                        classes={{root: classes.tabRoot, selected: classes.tabSelected}}
                        label="New Contract"
                    />
                    <Tab
                        disableRipple
                        classes={{root: classes.tabRoot, selected: classes.tabSelected}}
                        label="Exhibit"
                    />
                </Tabs>
                {value === 0 && <NewContract update={this.updateContractId}/>}
                {value === 1 && <ExhibitContract  contractId={this.state.contractId}/>}
            </div>
        );
    }
}

Contract.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Contract);