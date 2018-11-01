import React, { Component } from 'react';
import WorkOrdersTable from './WorkOrdersTable';
import WorkOrdersForm from './WorkOrdersForm';
import WorkOrdersView from './WorkOrdersView';
import withGlobalContent from 'Generic/Global';

class WorkOrders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            openModal: false,
            item: null
        };
    }

    handleClickOpenModal = () => {
        this.setState({ openModal: true, item: null });
    };
    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({ openModal: false });
    };

    onEditHandler = (item) => {
        this.setState({
            openModal: true,
            item: item
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-success float-right" onClick={this.handleClickOpenModal}>
                            Add Work Order <i className="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <WorkOrdersTable onEditHandler={this.onEditHandler} handleOpenSnackbar={this.props.handleOpenSnackbar} />
                    </div>
                </div>
                <WorkOrdersForm item={this.state.item} handleOpenSnackbar={this.props.handleOpenSnackbar} openModal={this.state.openModal} handleCloseModal={this.handleCloseModal} />
                <WorkOrdersView item={this.state.item} handleOpenSnackbar={this.props.handleOpenSnackbar} openModal={this.state.openModal} handleCloseModal={this.handleCloseModal} />
            </div>
        );
    }

}

export default withGlobalContent(WorkOrders);
