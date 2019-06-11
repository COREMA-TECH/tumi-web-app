import React, { Component } from 'react';
import { GET_INITIAL_DATA } from './Queries';

class Grid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...DEFAULT_STATE
        }
    }

    DEFAULT_STATE = {
        employees: []
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location != nextProps.location) {
            this.getEmployees(nextProps.location);
            this.getPosition();
        }
    }

    getEmployees = (idEntity) => {
        this.props.client.query({
            query: GET_INITIAL_DATA,
            fetchPolicy: 'no-cache',
            variables: {
                idEntity: idEntity
            }
        }).then(({ data }) => {
            //Save data into state
            //--Employees
            this.setState((prevState) => {
                return {}
            });

        }).catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                'Error loading employees list'
            );
        });
    }

    render() {
        return(
            <React.Fragment>

            </React.Fragment>
        );
    }

}

export default Grid;