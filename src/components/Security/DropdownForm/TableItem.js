import React, { Component } from 'react';
import { INSERT_ROL_FORM, UPDATE_ROL_FORM } from "./mutations";
import withGlobalContent from "../../Generic/Global";
import withApollo from "react-apollo/withApollo";

class TableItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false
        }
    }

    insertRolForm = (object) => {

        this.props.client
            .mutate({
                mutation: INSERT_ROL_FORM,
                variables: {
                    rolesforms: object
                }
            })
            .then(({ data }) => {

                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully saved',
                    'bottom',
                    'right'
                );

                this.props.updateRolForms();
            })
            .catch(error => {

                this.props.handleOpenSnackbar(
                    'error',
                    'Error to save permission. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };

    updateRolForm = (object) => {
        this.props.client
            .mutate({
                mutation: UPDATE_ROL_FORM,
                variables: {
                    rolesforms: object
                }
            })
            .then(({ data }) => {
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully updated',
                    'bottom',
                    'right'
                );

                this.props.updateRolForms();
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to update permission. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.asiggned
        });
    }

    render() {
        return (
            <tr>
                <td>
                    <input
                        type="checkbox"
                        checked={this.state.checked}
                        onChange={(e) => {
                            this.setState({
                                checked: e.target.checked
                            }, () => {
                                if (this.props.active) {

                                    let objectRolForm = {
                                        Id: this.props.idRolForm,
                                        IdRoles: this.props.rolId,
                                        IdForms: 0,
                                        IsActive: 1,
                                        User_Created: 1,
                                        User_Updated: 1,
                                        Date_Created: "2018-08-14",
                                        Date_Updated: "2018-08-14"
                                    };

                                    objectRolForm.IdForms = this.props.formId;
                                    if (this.state.checked) {
                                        objectRolForm.IsActive = 1;
                                    } else {
                                        objectRolForm.IsActive = 0;
                                    }
                                    this.updateRolForm(objectRolForm);
                                } else {
                                    let objectRolForm = {
                                        Id: this.props.idRolForm,
                                        IdRoles: this.props.rolId,
                                        IdForms: 0,
                                        IsActive: 1,
                                        User_Created: 1,
                                        User_Updated: 1,
                                        Date_Created: "2018-08-14",
                                        Date_Updated: "2018-08-14"
                                    };

                                    objectRolForm.IdForms = this.props.formId;
                                    if (this.state.checked) {
                                        objectRolForm.IsActive = 1;
                                    } else {
                                        objectRolForm.IsActive = 0;
                                    }

                                    this.insertRolForm(objectRolForm);
                                }
                            });
                        }}
                    /></td>
                <td>{this.props.code}</td>
                <td>{this.props.name}</td>
                <td>{this.props.url}</td>
                <td>{this.props.parent}</td>
            </tr>
        );
    }
}


export default withApollo(withGlobalContent(TableItem));

