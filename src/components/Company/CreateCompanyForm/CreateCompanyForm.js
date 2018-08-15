import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex: start',
        flexWrap: 'wrap',
        marginBottom: '30px'
    },
    formControl: {
        margin: theme.spacing.unit,
        width: '30%'
    },
    divStyle: {
        width: '80%'
    }
});

class ComposedTextField extends React.Component {
    state = {
        name: '',
    };

    handleChange = event => {
        this.setState({name: event.target.value});
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.divStyle}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Company Name</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Legal Name</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Location</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                </div>
                <div className={classes.divStyle}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Management Company</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Phone Number</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Start Date</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Work Week</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                </div>

                <div className={classes.divStyle}>
                    <br/><br/>
                    <h4>Others</h4>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Phone Number</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Rooms</InputLabel>
                        <Input id="name-simple" value={this.state.name} onChange={this.handleChange}/>
                    </FormControl>
                </div>
            </div>
        );
    }
}

ComposedTextField.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComposedTextField);