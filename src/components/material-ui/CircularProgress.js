import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
        color: '#41afd7'
    },
});

function CircularIndeterminate(props) {
    const {classes} = props;
    return (
        <div>
            <CircularProgress className={classes.progress} size={10}/>
        </div>
    );
}

CircularIndeterminate.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);