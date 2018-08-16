import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import ContactsTable from '../ContactsTable/ContactsTable';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";

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

        const ADD_TODO = gql`
            mutation inscompanies($type: iParamBC) {
                inscompanies(type: $type) {
                    Id
                }
            }

            input iParamBC {
                Id: Int
                Code: String
                Code01: String
                Id_Company: Int
                BusinessType: Int
                Name: String
                Description: String
                Start_Week: Int
                End_Week: Int
                Start_Date: String
                Legal_Name: String
                Country: Int
                State: Int
                Region: Int
                City: Int
                Id_Parent: Int
                IsActive: Int
                User_Created: Int
                User_Updated: Int
                Date_Created: String
                Date_Updated: String
                ImageURL: String
            }
        `;

        const test = () => (
            alert("Other test")
        );

        const AddTodo = () => {
            let input;
            return (
                <Mutation mutation={ADD_TODO}>
                    {(inscompanies, {data}) => (
                        inscompanies( {
                                variables: {
                                    Id: 4,
                                    Code: "'SSAS'",
                                    Code01: "'SSAS'",
                                    Id_Company: 1,
                                    BusinessType: 1,
                                    Name: "'SpringHill'",
                                    Description: "'SpringHill Austin South'",
                                    Start_Week: 1,
                                    End_Week: 7,
                                    Start_Day: 7,
                                    Legal_Name: "'White Lodging Services'",
                                    Country: 1,
                                    State: 1,
                                    Region: 1,
                                    City: 1,
                                    Id_Parent: 1,
                                    IsActive: 1,
                                    User_Created: 2,
                                    User_Updated: 2,
                                    Date_Created: "'2018-08-14 16:10:25+00'",
                                    Date_Updated: "'2018-08-14 16:10:25+00'",
                                    ImageURL: "'https://i.ytimg.com/vi/FDb0kIQXbfc/maxresdefault.jpg'"
                                }
                            }
                        )
                    )}
                </Mutation>
            );
        };

        return (
            <div className={classes.container}>
                <div className={classes.divStyle}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Name</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.username}
                            onChange={(text) => this.setState({username: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Email</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.email}
                            onChange={(text) => this.setState({email: text.target.value})}
                        />
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Phone Number</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.number}
                            onChange={(text) => this.setState({number: text.target.value})}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Kind Of Contact</InputLabel>
                        <Input
                            id="name-simple"
                            value={this.state.kind}
                            onChange={(text) => this.setState({kind: text.target.value})}
                        />
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() => {

                            // var item = {
                            //     username: this.state.username,
                            //     email: this.state.email,
                            //     number: this.state.number,
                            //     kind: this.state.kind
                            // };
                            //
                            // this.setState((prevState) => ({
                            //     // data: prevState.data.concat(item),
                            //     data: [item, ...prevState.data]
                            // }));
                            //
                            // this.setState({
                            //     username: '',
                            //     email: '',
                            //     number: '',
                            //     kind: ''
                            // });

                            {
                                AddTodo()
                            }

                            // AddTodo();
                            // console.log(AddTodo());
                        }}
                    >
                        Add Contact
                    </Button>
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
