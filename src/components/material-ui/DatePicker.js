import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});


function DatePickers(props) {
    const { classes } = props;

    return (
        <form className="select-large" noValidate>

            <TextField
                id="date"
                label="Start Date"
                type="date"
                onChange={(event) => (
                    props.update(event.target.value)
                )}
                defaultValue="2018-08-24"
                className="select-large"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </form>
    );
}

DatePickers.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePickers);