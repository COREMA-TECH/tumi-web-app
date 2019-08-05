import React, { Component } from "react";
import TimeCardTable from "./TimeCardTable";
import TimeCardForm from "./TimeCardForm";
import withGlobalContent from 'Generic/Global';
import { GET_REGION_QUERY } from './queries';
import withApollo from 'react-apollo/withApollo';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const styles = (theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 500
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        },
        '&:hover': {
            cursor: 'pointer'
        }
    },
    fab: {
        margin: theme.spacing.unit * 2
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3
    },
    th: {
        backgroundColor: '#3da2c7'
    }
});

class TimeCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            openModal: false,
            openLife: false,
            item: null,
            refresh: false
        };
    }

    handleClickOpenModal = () => {
        this.setState({ openModal: true, item: null });
    };

    handleCloseModal = (event) => {
        // event.preventDefault();
        this.setState({
            openModal: false

        });
    };

    onEditHandler = (item) => {
        this.setState({
            openModal: true,
            item: item
        });
    };

    toggleRefresh = () => {
        this.setState((prevState) => { return { refresh: !prevState.refresh } })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-success float-right" onClick={this.handleClickOpenModal}>
                            Add Time Card <i className="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <TimeCardTable
                            filter={0}
                            onEditHandler={this.onEditHandler}
                            handleOpenSnackbar={this.props.handleOpenSnackbar}
                            toggleRefresh={this.toggleRefresh}
                            handleCloseModal={this.handleCloseModal}
                        />
                    </div>
                </div>
                <TimeCardForm
                    item={this.state.item}
                    handleOpenSnackbar={this.props.handleOpenSnackbar}
                    openModal={this.state.openModal}
                    handleCloseModal={this.handleCloseModal}
                    toggleRefresh={this.toggleRefresh}
                />
            </div>
        );
    }

}

export default withGlobalContent(TimeCard);
