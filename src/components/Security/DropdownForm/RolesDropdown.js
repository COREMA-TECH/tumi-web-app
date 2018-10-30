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
import {GET_FORMS_QUERY} from "./queries";
import withGlobalContent from "../../Generic/Global";
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
        this.props.client
            .query({
                query: GET_FORMS_QUERY,
            })
            .then(({data}) => {
                this.setState({
                    dataForm: data.getforms
                })
            })
            .catch(error => {
                alert("Error to get forms");
            })
    };

    componentWillMount(){
        this.getFormsData();
    }

    render() {
        const { classes } = this.props;
        const { expanded } = this.state;
        let items = this.props.data;

        return (
            <div className={classes.root}>
                {
                    items.map(item => {
                        return (
                            <ExpansionPanel className="panel-dropdown" onChange={this.handleChange(uuidv4())}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>{item.Description}</Typography>
                                    <Typography className={classes.secondaryHeading}>0 Options</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails className="panel-body">
                                    <Typography>
                                        <DropdownBodyForm data={this.state.dataForm}/>
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