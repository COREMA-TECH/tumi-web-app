import React, {Component, Fragment} from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Accordion extends Component{

    state = {
        expanded: false
    }

    handleExpanded = () => {
        this.setState((prevState) => {
            return { expanded: !prevState.expanded }
        })
    }

    componentWillMount = () => {
        this.setState(() => ({
            expanded: this.props.expanded || false
        }))
    }

    render(){
        const { children, title } = this.props;
        return (
            <Fragment>
                <ExpansionPanel className="panel-dropdown" expanded={this.state.expanded}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} onClick={this.handleExpanded}>
                        <Typography>{title}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className="panel-dropdown-body">
                        { children }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Fragment>
        )
    }
}

export default Accordion;