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
import { GET_APPLICATION_STATUS } from './Queries';
import { withApollo } from 'react-apollo';
import IndependentContract from "./IndependentContract";


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
        independentContract: false
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    getApplicantStatus = () => {
        this.props.client
            .query({
                query: GET_APPLICATION_STATUS,
                fetchPolicy: 'no-cache',
                variables: {
                    id: this.state.applicationId
                }
            })
            .then(({ data }) => {
                this.setState({
                    applicationStatus: data.applicationCompletedData
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
        // this.setState({
        //     applicationStatus: {
        //         ...this.state.applicationStatus,
        //         [tab]: true
        //     }
        // });
        this.getApplicantStatus();
    }

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        if (this.state.applicationId == 0) {
            this.state.applicationId = localStorage.getItem('idApplication');
        }

        let getTabContent = (step) => {
            switch (step) {
                case 0:
                    return <ApplicationInfo applicationId={this.state.applicationId} handleContract={this.handleContract} />;
                case 1:
                    return <ProfilePreview applicationId={this.state.applicationId} />;
                case 2:
                    return <BackgroundCheck applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
                case 3:
                    return <NonDisclosure applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
                case 4:
                    return <ConductCode applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
                case 5:
                    return <AntiHarassment applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
                case 6:
                    return <WorkerCompensation applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
                case 7:
                    return <FormsI9 applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
                case 8:
                    return <FormsW4 applicationId={this.state.applicationId} changeTabState={this.changeTabState} />;
                case 9:
                    return <ApplicantDocument applicationId={this.state.applicationId} />;
                case 10:
                    return <IndependentContract applicationId={this.state.applicationId} />

            }
        };
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <Tabs
                        value={this.state.applicationId == 0 ? 0 : value}
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
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon Tab-fa-circle ${!this.state.applicationStatus.ApplicantBackgroundCheck ? 'incomplete' : 'completed'}` }}
                            label={applyTabs[2].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon Tab-fa-circle ${!this.state.applicationStatus.ApplicantDisclosure ? 'incomplete' : 'completed'}` }}
                            label={applyTabs[3].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon Tab-fa-circle ${!this.state.applicationStatus.ApplicantConductCode ? 'incomplete' : 'completed'}` }}
                            label={applyTabs[4].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon Tab-fa-circle ${!this.state.applicationStatus.ApplicantHarassmentPolicy ? 'incomplete' : 'completed'}` }}
                            label={applyTabs[5].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon Tab-fa-circle ${!this.state.applicationStatus.ApplicantWorkerCompensation ? 'incomplete' : 'completed'}` }}
                            label={applyTabs[6].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon Tab-fa-circle ${!this.state.applicationStatus.ApplicantI9 ? 'incomplete' : 'completed'}` }}
                            label={applyTabs[7].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: `Tab-fa-icon Tab-fa-circle ${!this.state.applicationStatus.ApplicantW4 ? 'incomplete' : 'completed'}` }}
                            label={applyTabs[9].label}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: "Tab-item", selected: "Tab-selected", label: 'Tab-fa-icon' }}
                            label={applyTabs[8].label}
                        />
                        {
                            this.state.independentContract ? (
                                <Tab
                                    disableRipple
                                    classes={{ root: "Tab-item", selected: "Tab-selected", label: 'Tab-fa-icon' }}
                                    label={'Independent Contract'}
                                />
                            ) : (
                                    ''
                                )
                        }

                    </Tabs>
                    {getTabContent(this.state.applicationId == 0 ? 0 : value)}
                </MuiThemeProvider>
            </div>
        );
    }
}

CustomizedTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withApollo(withStyles(styles)(CustomizedTabs));