import React, { Component } from 'react';
import WorkOrdersTable from './WorkOrdersTable';
import WorkOrdersForm from './WorkOrdersForm';

class WorkOrders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            openModal: false
        };
    }

    handleClickOpenModal = () => {
        this.setState({ openModal: true });
    };
    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({ openModal: false });
    };

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
                        <WorkOrdersTable></WorkOrdersTable>
                    </div>
                </div>
                <WorkOrdersForm openModal={this.state.openModal} handleCloseModal={this.handleCloseModal}></WorkOrdersForm>
            </div>
        );
    }

}

export default WorkOrders;