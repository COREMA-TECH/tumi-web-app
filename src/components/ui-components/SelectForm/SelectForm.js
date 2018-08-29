import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import './index.css';
const uuidv4 = require('uuid/v4');

const styles = theme => ({
    formControl: {
        minWidth: 180,
        background: '#fff'
    },
    select: {
        border: '1px solid #E6E6E6',
        borderRadius: '5px',
        zIndex: 1000
    },
});

class ControlledOpenSelect extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        age: '',
        open: false,
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    render() {
        const { classes } = this.props;

        return (
            <form autoComplete="off">
                <FormControl className="select-form-customized default">
                    <Select
                        className={classes.select}
                        open={this.state.open}
                        onClose={this.handleClose}
                        onOpen={this.handleOpen}
                        value={this.state.age}
                        onChange={this.handleChange}
                        inputProps={{
                            name: 'age',
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {
                            this.props.data.map(item => {
                                return <MenuItem key={uuidv4()} value={item.Id}>{item.Name}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </form>
        );
    }
}

ControlledOpenSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledOpenSelect);