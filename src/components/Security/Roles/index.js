import React, { Component, Fragment } from 'react';
import RolesTable from './RolesTable';
import {GET_ROLES_QUERY} from './Queries';

class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataForms: [],
            company: [],
            loading: false
        };
    }

    loadRoles = () => {
        this.props.client
            .query({
                query: GET_ROLES_QUERY,
                variables: {},
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getroles != null) {
                    this.setState(
                        {
                            data: data.data.getroles,
                            dataForms: data.data.getforms
                        },
                        () => {
                            this.resetState();
                        }
                    );
                } else {
                    this.props.handleOpenSnackbar('error', 'Error: Loading roles: getroles not exists in query data');
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading roles: ' + error);
            });
    };

    componentWillMount() {
        this.loadRoles();
        this.loadCompanies();
    }

    render() {
        return <Fragment>
            <div className="row"></div>

            <div className="row">
                <div className="col-md-12">
                    <RolesTable
                        data={this.state.data}
                        dataForms={this.state.dataForms}
                        company={this.state.company}
                        loading={this.state.loading}
                        onEditHandler={this.onEditHandler}
                        onDeleteHandler={this.onDeleteHandler}
                    />
                </div>
            </div>
        </Fragment>
    }
}

export default Roles;

// TODO: (LF) Quitar codigo comentado
//import RolesForm from './RolesForm';
//export default RolesForm;
