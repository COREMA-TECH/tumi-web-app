import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = (theme) => ({
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
        legalName: '',
        location: '',
        management: '',
        phoneNumber: '',
        startDate: '',
        workWeek: '',
        otherPhoneNumber: '',
        room: ''
    };



    render() {
        const {classes} = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.divStyle}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Company Name</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.name}
                            onChange={(text) => this.setState({name: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Legal Name</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.legalName}
                            onChange={(text) => this.setState({legalName: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Location</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.location}
                            onChange={(text) => this.setState({location: text.target.value})}
                        />
                    </FormControl>
                </div>
                <div className={classes.divStyle}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Management Company</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.management}
                            onChange={(text) => this.setState({management: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Phone Number</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.phoneNumber}
                            onChange={(text) => this.setState({phoneNumber: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Start Date</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.startDate}
                            onChange={(text) => this.setState({startDate: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Work Week</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.workWeek}
                            onChange={(text) => this.setState({workWeek: text.target.value})}
                        />
                    </FormControl>
                </div>

                <div className={classes.divStyle}>
                    <br/>
                    <br/>
                    <h4>Others</h4>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Phone Number</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.otherPhoneNumber}
                            onChange={(text) => this.setState({
                                otherPhoneNumber: text.target.value
                            })}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Rooms</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.room}
                            onChange={(text) => this.setState({
                                room: text.target.value
                            })}
                        />
                    </FormControl>
                </div>
            </div>
        );
    }
}

ComposedTextField.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ComposedTextField);
