import React, { Component } from "react";
import TimeCardTable from "./TimeCardTable";
import TimeCardForm from "./TimeCardForm";
import withGlobalContent from 'Generic/Global';

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

    handleCloseModal = () => {
        this.setState({
            openModal: false
        }, _ => {
            this.toggleRefresh();
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
