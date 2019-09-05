import React, { Component } from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DropDownBody from './DropDownBody';
import moment from 'moment';

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

class PunchesConsolidatedDropDown extends Component {

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    render() {
        const { classes } = this.props;
        let data = this.props.data || [];
        return <div className={classes.root}>
            {data.map(item => {
                return <ExpansionPanel className="panel-dropdown" style={{marginTop: 0}} onChange={this.handleChange(uuidv4())}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{moment(item.date).format('MMMM Do YYYY')}</Typography>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className="panel-dropdown-body">
                        <Typography>
                            <DropDownBody data={item.punches} handleEditModal={this.props.handleEditModal}></DropDownBody>
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            })
            }
        </div>
    }
}

PunchesConsolidatedDropDown.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PunchesConsolidatedDropDown);