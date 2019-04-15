import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const uuidv4 = require('uuid/v4');

const styles = theme => ({
    button: {
        display: 'block',
        marginTop: theme.spacing.unit * 2,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: '60%',
    },
});

class ControlledOpenSelect extends React.Component {
    state = {
        age: '',
        open: false,
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
        // this.props.update(event.target.value);
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    render() {
        const {classes} = this.props;

        return (
            <form autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="demo-controlled-open-select">{this.props.label}</InputLabel>
                    <Select
                        open={this.state.open}
                        onClose={this.handleClose}
                        onOpen={this.handleOpen}
                        value={this.state.age}
                        onChange={this.handleChange}
                        inputProps={{
                            name: 'age',
                            id: 'demo-controlled-open-select',
                        }}
                    >
                        <MenuItem value={this.props.label}>
                            <em>None</em>
                        </MenuItem>
                        {
                            this.props.values.map(item => {
                                if(this.props.idCompany === item.Id){
                                    // Nothing
                                } else {
                                    return <MenuItem key={uuidv4()} value={item.Id}>{item.Name}</MenuItem>
                                }
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
