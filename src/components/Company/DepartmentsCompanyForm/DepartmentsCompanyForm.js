import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import ContactsTable from "../ContactsTable/ContactsTable";
import DepartmentsTable from "../DepartmentsTable";

const styles = theme => ({
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
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

class ContactCompanyForm extends React.Component {
    state = {
        name: '',
        data: [],
        code: '',
        description: '',
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
                        <InputLabel htmlFor="name-simple">Code</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.code}
                            onChange={(text) => this.setState({code: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Description</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.description}
                            onChange={(text) => this.setState({description: text.target.value})}
                        />
                    </FormControl>

                    <Button variant="contained" color="primary" className={classes.button} onClick={
                        () => {
                            var item = {
                                code: this.state.code,
                                description: this.state.description,
                            };

                            this.setState(prevState => ({
                                // data: prevState.data.concat(item),
                                data: [item, ...prevState.data],
                                code: '',
                                description: '',
                            }));
                        }
                    }>
                        Add Department
                    </Button>
                </div>
                <div className={classes.divStyle}>
                    <DepartmentsTable data={this.state.data}/>
                </div>
            </div>
        );
    }
}

ContactCompanyForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContactCompanyForm);