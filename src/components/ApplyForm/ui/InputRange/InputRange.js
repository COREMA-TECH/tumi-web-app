import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const styles = {
    root: {
        width: 300,
    },
};

class SimpleSlider extends React.Component {
    state = {
        value: 50,
    };

    handleChange = (event, value) => {
        this.setState({ value });

        // Update state parent component - percent skill
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <div className={classes.root}>
                <Slider value={value} aria-labelledby="label" onChange={this.handleChange} />
                <Typography id="label">{this.state.value + "%"} </Typography>
            </div>
        );
    }
}

SimpleSlider.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSlider);