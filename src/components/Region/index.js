import React, { Component } from "react";
import RegionTable from "./RegionTable";
import RegionForm from "./RegionForm";
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

class Region extends Component {
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


    getRegions = () => {

        this.props.client
            .query({
                query: GET_REGION_QUERY,
                variables: {},
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    data: data.getcatalogitem

                });
            })
            .catch();
    };


    componentWillMount() {
        this.getRegions();
    }

    handleClickOpenModal = () => {
        this.setState({ openModal: true, item: null });
    };

    handleCloseModal = (event) => {
        event.preventDefault();
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
        this.getRegions();
        this.setState({
            openModal: false

        });
        // this.setState((prevState) => { return { refresh: !prevState.refresh } })
    }


    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-success float-right" onClick={this.handleClickOpenModal}>
                            Add Region <i className="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <RegionTable
                            filter={0}
                            onEditHandler={this.onEditHandler}
                            handleOpenSnackbar={this.props.handleOpenSnackbar}
                            toggleRefresh={this.toggleRefresh}
                            dataRegions={this.state.data}
                        />
                    </div>
                </div>
                <RegionForm
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
//export default withGlobalContent(Region);
export default withStyles(styles)(withApollo(Region));
