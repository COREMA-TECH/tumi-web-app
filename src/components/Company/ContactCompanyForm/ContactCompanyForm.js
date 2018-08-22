import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ContactsTable from '../ContactsTable/ContactsTable';

const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px'
    },
    formControl: {
        margin: theme.spacing.unit,
        width: '18%'
    },
    divStyle: {
        width: '80%',
        display: 'flex',
        justifyContent: 'space-around'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    }
});

class ContactCompanyForm extends React.Component {
    state = {
        name: '',
        data: [],
        username: '',
        email: '',
        number: '',
        kind: ''
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.divStyle}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Name</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.department}
                            onChange={(text) => this.setState({username: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Email</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.position}
                            onChange={(text) => this.setState({email: text.target.value})}
                        />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Phone Number</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.billRate}
                            onChange={(text) => this.setState({number: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Kind Of Contact</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.payRate}
                            onChange={(text) => this.setState({kind: text.target.value})}
                        />
                    </FormControl>


                </div>
                <div className={classes.divStyle}>
                    <ContactsTable data={this.state.data}/>
                </div>
            </div>
        );
    }
}

ContactCompanyForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContactCompanyForm);
