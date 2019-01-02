import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import { CHANGE_STATUS_SHIFT } from './Mutations';
import renderHTML from 'react-render-html';
import { stat } from 'fs';

class SchedulesAccept extends Component {

    constructor() {
        super();
        this.state = {
            id: 0,
            msg: '',
            accept: true
        }
    }

    handleChangeStatusShifts = (status, color) => {
        this.props.client
            .mutate({
                mutation: CHANGE_STATUS_SHIFT,
                variables: {
                    id: this.state.id,
                    status: status,
                    color: color
                }
            })
            .then((data) => {
                if (status == 2) { this.props.handleOpenSnackbar('success', 'Shift approved successfully!'); }
                else { this.props.handleOpenSnackbar('success', 'Shift rejected successfully!'); }

            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error approved Shift');
            });
    };

    componentWillMount() {
        var accept = this.props.match.params.accept;
        var id = this.props.match.params.id;
        var status = 0;
        var color;
        var msg = '';

        if (accept == 'true') {
            status = 2
            color = "#114bff";
            msg = 'Thanks for Accept our offer, await for you soon :)';
        } else {
            status = 3
            color = "#cccccc";
            msg = 'We regret that you can not accept our offer :( <br/>';
            msg += '<span class="font-weight-bold">Tell us the reason</span>';
        }

        if (status != 0 && status == 2) {
            this.setState({
                id: id,
                msg: msg,
                accept: accept
            },
                // this.handleChangeStatusShifts(status, color)
            );
        } else {
            this.setState({
                id: id,
                msg: msg,
                accept: accept
            });
        }
    }

    render() {
        return (
            <div className="gradiant-overlay">
                <h2 className="gradiant-overlay-message">{renderHTML(this.state.msg)}</h2>
                {
                    this.state.accept != 'true' ? (
                        <div className="mt-1 reason-wrapper">
                            <textarea name="" id="" cols="30" rows="10" className="form-control"></textarea>
                            <button className="btn btn-success mt-2">Send</button>
                        </div>
                    ) : ('')
                }
            </div>
        );
    }

}

export default withApollo(SchedulesAccept);