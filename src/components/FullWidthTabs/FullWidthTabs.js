import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CreateCompanyForm from '../Company/CreateCompanyForm/CreateCompanyForm';
import ContactCompanyForm from '../Company/ContactCompanyForm/ContactCompanyForm';
import DepartmentsCompanyForm from '../Company/DepartmentsCompanyForm/DepartmentsCompanyForm';
import PositionsCompanyForm from "../Company/PositionsCompanyForm/PositionsCompanyForm";

function TabContainer({children, dir}) {
    return (
        <Typography
            component="div"
            dir={dir}
            style={[
                {
                    border: '1px solid #ddd'
                }
            ]}
        >
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired
};

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%'
    }
});

class FullWidthTabs extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    handleChangeIndex = (index) => {
        this.setState({value: index});
    };

    handleText = (message) => {
        alert(message)
    };

    render() {
        const {classes, theme} = this.props;

        return (
            <div className={classes.root}>
                <Tabs
                    value={this.props.item}
                    onChange={this.props.item}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                />
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.props.item}
                    onChangeIndex={this.handleChangeIndex}
                >
                    <TabContainer dir={theme.direction}>
                        <CreateCompanyForm title="General info" idCompany={this.props.idCompany}/>
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <ContactCompanyForm/>
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <DepartmentsCompanyForm/>
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <PositionsCompanyForm/>
                    </TabContainer>
                </SwipeableViews>
            </div>
        );
    }
}

FullWidthTabs.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, {withTheme: true})(FullWidthTabs);
