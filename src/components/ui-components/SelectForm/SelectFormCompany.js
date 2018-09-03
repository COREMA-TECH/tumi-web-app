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

        // if(this.props.label === "Departments") {
        //     this.props.values.map(item => {
        //         if(event.target.value === item.Id){
        //             this.props.update(item.Name);
        //         }
        //     })
        // } else {
        //     this.props.update(event.target.value);
        // }

        this.props.update(event.target.value);
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
                        <MenuItem value="" className="select-form-customized__item">
                            <em className="add-company" onClick={this.props.addCompany('paper')}>Agregar Compañía</em>
                        </MenuItem>
                        {
                            this.props.data.map(item => {
                                return <MenuItem className="select-form-customized__item" key={uuidv4()} value={item.Id}>{item.Name}</MenuItem>
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