import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BackgroundCheck from "./BackgroundCkeck/BackgroundCheck";
import NonDisclosure from "./NonDisclosure/NonDisclosure";
import ApplicationInfo from "./ApplicationInfo";
import ConductCode from "./ConductCode/ConductCode";
import AntiHarassment from "./AntiHarassment/AntiHarassment";
import WorkerCompensation from "./WorkerCompensation/WorkerCompensation";
import ApplicantDocument from "./ApplicantDocuments/ApplicantDocument";
import ProfilePreview from "./ProfilePreview/ProfilePreview";

const applyTabs = require(`./languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);

const theme = createMuiTheme({
    overrides: {
        MuiTabs: { // Name of the component ⚛️ / style sheet

        },
    },
});

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    tabsRoot: {
        borderBottom: '1px solid #e8e8e8',
    },
    tabsIndicator: {
        backgroundColor: '#41afd7',
    },
    tabRoot: {
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
            color: '#41afd7',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#41afd7',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#41afd7',
        },
    },
    tabSelected: {},
    typography: {
        padding: theme.spacing.unit * 3,
    },
});

class CustomizedTabs extends React.Component {
    state = {
        value: 0,
        applicationId: null,
        openSignature: false
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentWillMount() {
        try {
            if (this.props.location.state.ApplicationId === undefined)
                window.location.href = "/home/application";

            localStorage.setItem('languageForm', 'en');

            this.setState({
                applicationId: this.props.location.state.ApplicationId
            });
        } catch (error) {
            window.location.href = "/home/application";
        }
    }

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        let getTabContent = (step, ) => {
            switch (step) {
                case 0:
                    return <ApplicationInfo applicationId={this.state.applicationId} />;
                case 1:
                    return <BackgroundCheck applicationId={this.state.applicationId} />;
                case 2:
                    return <NonDisclosure applicationId={this.state.applicationId} />;
                case 3:
                    return <ConductCode applicationId={this.state.applicationId} />;
                case 4:
                    return <AntiHarassment applicationId={this.state.applicationId} />;
                case 5:
                    return <WorkerCompensation applicationId={this.state.applicationId} />;
                case 6:
                    return <ApplicantDocument applicationId={this.state.applicationId} />;
                case 7:
                    return <ProfilePreview applicationId={this.state.applicationId}/>;
            }
        };

        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        scrollable
                        scrollButtons="on"
                        classes={{ root: "Tabs-wrapper", indicator: "Tab-selectedBorder", flexContainer: "Tabs-wrapperFluid" }}
                    >
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected" }}
                            label={applyTabs[0].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected" }}
                            label={applyTabs[1].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected" }}
                            label={applyTabs[2].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected" }}
                            label={applyTabs[3].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected" }}
                            label={applyTabs[4].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected" }}
                            label={applyTabs[5].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected" }}
                            label={applyTabs[6].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected" }}
                            label={applyTabs[7].label}
                        />
                    </Tabs>
                    {getTabContent(value)}
                </MuiThemeProvider>
            </div>
        );
    }
}

CustomizedTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTabs);