import React, { Component } from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DropDownBody from './DropDownBody';

const uuidv4 = require('uuid/v4');

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

class DropDown extends Component {

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    render() {
        const { classes } = this.props;
        let data = this.props.data || [];
        return <div className={classes.root}>
            {data.map((item, i) => {
                const historical = this.props.historicalDocuments.filter(h => h.ApplicationDocumentTypeId === item.id);
                return <ExpansionPanel key={i} className="panel-dropdown" style={{ marginTop: 0 }} onChange={this.handleChange(uuidv4())}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{item.label}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className="panel-dropdown-body">
                        <Typography>
                            <DropDownBody data={historical} />
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            })
            }
        </div>
    }
}

DropDown.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DropDown);