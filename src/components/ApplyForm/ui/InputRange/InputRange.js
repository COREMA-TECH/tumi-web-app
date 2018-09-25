import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const styles = {
    root: {
        width: '100%',
    },
    slider: {
        background: '#3ca2c8',
        borderRadius: '5px',
        borderColor: '#3ca2c8',
    },
    labelSlider: {
        color: '#777',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px'
    },
    labelLevelSkill: {
        color: '#777',
        fontSize: '12px',
        fontStyle: 'italic'
    },
    labelPercentSkill: {
        color: '#3ca2c8',
        fontSize: '13px'
    }
};

class SimpleSlider extends React.Component {
    state = {
        value: 50,
    };

    handleChange = (event, value) => {
        this.setState(
            {value},
            () => {
                // Update state parent component - percent skill
                this.props.getPercentSkill(parseInt(Math.floor(this.state.value)));
            });
    };

    render() {
        const {classes} = this.props;
        const {value} = this.state;

        return (
            <div className={classes.root}>
                <Slider value={value} className={'input-form'} aria-labelledby="label" onChange={this.handleChange}/>
                <div className={classes.labelSlider}>
                    <span className={classes.labelLevelSkill}>Newbie</span>
                    <Typography className={classes.labelPercentSkill}
                                id="label">{Math.floor(this.state.value) + "%"} </Typography>
                    <span className={classes.labelLevelSkill}>Expert</span>
                </div>
            </div>
        );
    }
}

SimpleSlider.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSlider);