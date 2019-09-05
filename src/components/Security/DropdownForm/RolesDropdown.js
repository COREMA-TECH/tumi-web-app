import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DropdownBodyForm from "./DropdownBodyForm";
import withApollo from "react-apollo/withApollo";
import { GET_FORMS_QUERY } from "./queries";
import withGlobalContent from "../../Generic/Global";
import { INSERT_ROL_FORM } from "./mutations";
const uuidv4 = require('uuid/v4');

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

class ControlledExpansionPanels extends React.Component {
    state = {
        expanded: null,
        dataForm: []
    };

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    getFormsData = () => {
        this.setState({
            loadingData: true
        }, () => {
            this.props.client
                .query({
                    query: GET_FORMS_QUERY,
                })
                .then(({ data:{forms} }) => {
                    this.setState({
                        dataForm: forms
                    })

                    this.setState({
                        loadingData: false
                    });
                })
                .catch(error => {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to get data. Please, try again!',
                        'bottom',
                        'right'
                    );

                    this.setState({
                        loadingData: false
                    });
                })
        });
    };

    componentWillMount() {
        this.getFormsData();
    }

    render() {
        const { classes } = this.props;
        const { expanded } = this.state;
        let items = this.props.data;

        if (this.state.loadingData) {
            return <div></div>
        }

        return (
            <div className={classes.root}>
                {
                    items.map(item => {

                        return (
                            <ExpansionPanel className="panel-dropdown" onChange={this.handleChange(uuidv4())}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>{item.Description}</Typography>

                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails className="panel-body">
                                    <Typography>
                                        <DropdownBodyForm
                                            rolId={item.Id}
                                            data={this.state.dataForm}
                                            handleInsert={this.handleInsertRolForm}
                                            closeItem={() => {
                                                this.handleChange(uuidv4())
                                            }}
                                        />
                                    </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    })
                }
            </div>
        );
    }
}

ControlledExpansionPanels.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(withGlobalContent(ControlledExpansionPanels)));