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
import FormsI9 from './I9/FormsI9';
import FormsW4 from "./W4/FormsW4";
import { GET_APPLICATION_STATUS, GET_COMPLETED_STATUS } from './Queries';
import { withApollo } from 'react-apollo';
import IndependentContract from "./IndependentContract";
import ApplicationInternal from './ApplicationInternal';
import Summary from './Summary/Summary';
import Documents from './Documents';


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
        openSignature: false,
        applicationStatus: {},
        independentContract: false,
        disableTabs: true
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    getApplicantStatus = () => {
        if (!this.state.applicationId || this.state.applicationId === 0)
            return;
        this.props.client
            .query({
                query: GET_COMPLETED_STATUS,
                fetchPolicy: 'no-cache',
                variables: {
                    id: this.state.applicationId
                }
            })
            .then(({ data }) => {
                this.setState({
                    applicationStatus: data.applicationCompleted
                });
            })
            .catch();
    }

    componentWillMount() {
        try {
            if (this.props.location.state.ApplicationId === undefined)
                window.location.href = "/home/application";

            //localStorage.setItem('languageForm', 'en');
            this.setState({
                applicationId: this.props.location.state.ApplicationId
            }, () => {
                this.getApplicantStatus();
            });
        } catch (error) {
            window.location.href = "/home/application";
        }
    }

    handleContract = () => {
        this.setState({
            independentContract: true
        })
    };

    changeTabState = (tab) => {
        this.getApplicantStatus();
    }

    setApplicantId = (id) => {
        this.setState((prevState, prevProps) => {
            return { applicationId: id }
        });
    }

    getTabContent = (step, ) => {
        switch (step) {
            case 0:
                return <ApplicationInfo enableTabs={this.enableTabs} applicationId={this.state.applicationId} handleContract={this.handleContract} setApplicantId={this.setApplicantId} />;
            case 1:
                return <ApplicationInternal applicationId={this.state.applicationId} />
            case 2:
                return <Summary applicationId={this.state.applicationId} />
            case 3:
                return <ProfilePreview applicationId={this.state.applicationId} />;
            case 4:
                return <Documents applicationId={this.state.applicationId} changeTabState={this.changeTabState} getApplicantStatus={this.getApplicantStatus} />;
            case 5:
                return <NonDisclosure applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
            case 6:
                return <ConductCode applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
            case 7:
                return <AntiHarassment applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
            case 8:
                return <WorkerCompensation applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
            case 9:
                return <FormsI9 applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
            case 10:
                return <FormsW4 applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
            case 11:
                return <ApplicantDocument applicationId={this.state.applicationId} />;
            case 12:
                return <IndependentContract applicationId={this.state.applicationId} />;

        }
    };

    enableTabs = (enable = false) => {
        this.setState(_ => ({
            disableTabs: enable
        }));
    }

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <React.Fragment>
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
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon` }}
                            label={applyTabs[0].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: 'Tab-fa-icon' }}
                            label={applyTabs[1].label}
                            disabled={this.state.disableTabs}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: 'Tab-fa-icon' }}
                            label={applyTabs[11].label}
                            disabled={this.state.disableTabs}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: 'Tab-fa-icon' }}
                            label={applyTabs[2].label}
                            disabled={this.state.disableTabs}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon Tab-fa-circle ${!this.state.applicationStatus ? 'incomplete' : 'completed'}` }}
                            label={applyTabs[3].label}
                            disabled={this.state.disableTabs}
                        />
                        {this.state.independentContract ? <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: 'Tab-fa-icon' }}
                            label={applyTabs[12].label}
                        /> : <React.Fragment />}


                    </Tabs>
                    {this.getTabContent(value)}
                </MuiThemeProvider>
            </React.Fragment>
        );
    }
}

CustomizedTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withApollo(withStyles(styles)(CustomizedTabs));